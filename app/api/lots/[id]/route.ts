import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, quantity, costPrice, salePrice, supplier, category, variety, process, roastDate, status } = body

    const sql = getDb()

    const oldLots = await sql`
      SELECT * FROM lots WHERE id = ${Number.parseInt(id)}
    `

    if (oldLots.length === 0) {
      return NextResponse.json({ error: "Lote não encontrado" }, { status: 404 })
    }

    const oldLot = oldLots[0]

    const lots = await sql`
      UPDATE lots
      SET
        name = COALESCE(${name}, name),
        quantity = COALESCE(${quantity ? Number.parseFloat(quantity) : null}, quantity),
        cost_price = COALESCE(${costPrice ? Number.parseFloat(costPrice) : null}, cost_price),
        sale_price = COALESCE(${salePrice ? Number.parseFloat(salePrice) : null}, sale_price),
        supplier = COALESCE(${supplier}, supplier),
        category = COALESCE(${category}, category),
        variety = COALESCE(${variety}, variety),
        process = COALESCE(${process}, process),
        roast_date = COALESCE(${roastDate ? new Date(roastDate) : null}, roast_date),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    const lot = lots[0]

    const changes: string[] = []

    if (name && name !== oldLot.name) {
      changes.push(`Nome alterado de "${oldLot.name}" para "${name}"`)
    }
    if (status && status !== oldLot.status) {
      changes.push(`Status alterado de "${oldLot.status}" para "${status}"`)
    }
    if (quantity && Number.parseFloat(quantity) !== oldLot.quantity) {
      changes.push(`Quantidade alterada de ${oldLot.quantity}kg para ${quantity}kg`)
    }
    if (costPrice && Number.parseFloat(costPrice) !== oldLot.cost_price) {
      changes.push(`Preço de compra alterado de R$ ${oldLot.cost_price} para R$ ${costPrice}`)
    }
    if (salePrice && Number.parseFloat(salePrice) !== oldLot.sale_price) {
      changes.push(`Preço de venda alterado de R$ ${oldLot.sale_price} para R$ ${salePrice}`)
    }
    if (supplier && supplier !== oldLot.supplier) {
      changes.push(`Fornecedor alterado para "${supplier}"`)
    }
    if (category && category !== oldLot.category) {
      changes.push(`Categoria alterada para "${category}"`)
    }
    if (variety && variety !== oldLot.variety) {
      changes.push(`Variedade alterada para "${variety}"`)
    }
    if (process && process !== oldLot.process) {
      changes.push(`Processo alterado para "${process}"`)
    }
    if (roastDate && new Date(roastDate).toISOString() !== new Date(oldLot.roast_date).toISOString()) {
      changes.push(`Data da torra alterada`)
    }

    const actionDetails =
      changes.length > 0 ? `Lote "${lot.name}": ${changes.join(", ")}` : `Lote "${lot.name}" foi atualizado`

    await sql`
      INSERT INTO logs (user_id, lot_id, action, details, created_at)
      VALUES (
        ${Number.parseInt(session.user.id)},
        ${lot.id},
        'update_lot',
        ${actionDetails},
        NOW()
      )
    `

    const formattedLot = {
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
    }

    return NextResponse.json(formattedLot)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao atualizar lote",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
