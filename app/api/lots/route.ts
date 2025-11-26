import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeString, sanitizeNumber } from "@/lib/sanitize"

// GET /api/lots - Listar todos os lotes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const sql = getDb()
    const lots = await sql`
      SELECT * FROM lots
      ORDER BY created_at DESC
    `

    const formattedLots = lots.map((lot) => ({
      id: lot.id,
      name: lot.name,
      quantity: lot.quantity,
      costPrice: lot.cost_price,
      salePrice: lot.sale_price,
      supplier: lot.supplier,
      category: lot.category,
      variety: lot.variety,
      process: lot.process,
      roastDate: lot.roast_date,
      entryDate: lot.created_at,
      expiryDate: lot.expiry_date,
      status: lot.status,
    }))

    return NextResponse.json(formattedLots)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar lotes. Tente novamente." }, { status: 500 })
  }
}

// POST /api/lots - Criar novo lote
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (!rateLimit(`create-lot:${session.user.id}`, { interval: 5 * 60 * 1000, maxRequests: 30 })) {
      return NextResponse.json(
        { error: "Muitas criações de lotes. Aguarde alguns minutos." },
        { status: 429 }
      )
    }

    const body = await request.json()

    const { name, quantity, costPrice, salePrice, supplier, category, variety, process, roastDate, status } = body

    if (!name || !quantity || !costPrice || !salePrice || !category) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios faltando",
          details: {
            name: !name ? "Nome é obrigatório" : null,
            quantity: !quantity ? "Quantidade é obrigatória" : null,
            costPrice: !costPrice ? "Preço de compra é obrigatório" : null,
            salePrice: !salePrice ? "Preço de venda é obrigatório" : null,
            category: !category ? "Categoria é obrigatória" : null,
          },
        },
        { status: 400 },
      )
    }

    const sanitizedName = sanitizeString(name)
    const sanitizedSupplier = supplier ? sanitizeString(supplier) : null
    const sanitizedVariety = variety ? sanitizeString(variety) : null
    const sanitizedProcess = process ? sanitizeString(process) : null

    const quantityNum = sanitizeNumber(quantity)
    const costPriceNum = sanitizeNumber(costPrice)
    const salePriceNum = sanitizeNumber(salePrice)

    if (quantityNum === null || quantityNum <= 0) {
      return NextResponse.json({ error: "A quantidade deve ser um número maior que zero" }, { status: 400 })
    }

    if (costPriceNum === null || costPriceNum < 0) {
      return NextResponse.json({ error: "O preço de compra deve ser um número válido não negativo" }, { status: 400 })
    }

    if (salePriceNum === null || salePriceNum < 0) {
      return NextResponse.json({ error: "O preço de venda deve ser um número válido não negativo" }, { status: 400 })
    }

    const allowedCategories = ["Blend", "Single Origin"]
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: "Categoria inválida. Use 'Blend' ou 'Single Origin'" }, { status: 400 })
    }

    const allowedStatuses = ["Encomendado", "Chegou", "Em Estoque", "Embalado", "Vendido"]
    const sanitizedStatus = status || "Em Estoque"
    if (!allowedStatuses.includes(sanitizedStatus)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    const sql = getDb()

    const lots = await sql`
      INSERT INTO lots (
        name, 
        quantity, 
        cost_price, 
        sale_price, 
        supplier, 
        category, 
        variety, 
        process, 
        roast_date, 
        status
      )
      VALUES (
        ${sanitizedName},
        ${quantityNum},
        ${costPriceNum},
        ${salePriceNum},
        ${sanitizedSupplier},
        ${category},
        ${sanitizedVariety},
        ${sanitizedProcess},
        ${roastDate ? new Date(roastDate) : null},
        ${sanitizedStatus}
      )
      RETURNING *
    `

    const lot = lots[0]

    await sql`
      INSERT INTO logs (user_id, lot_id, action, details, created_at)
      VALUES (
        ${Number.parseInt(session.user.id)},
        ${lot.id},
        'create_lot',
        ${`Lote "${sanitizedName}" (${category}) criado com ${quantityNum}kg - Status: ${sanitizedStatus}`},
        NOW()
      )
    `

    return NextResponse.json(lot, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao criar lote. Verifique os dados e tente novamente.",
      },
      { status: 500 },
    )
  }
}
