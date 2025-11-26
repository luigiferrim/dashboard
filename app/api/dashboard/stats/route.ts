import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const sql = getDb()

    const statusCounts = await sql`
      SELECT status, COUNT(*) as count, COALESCE(SUM(quantity), 0) as total_quantity
      FROM lots
      GROUP BY status
    `

    const encomendadoCount = statusCounts.find((s) => s.status === "Encomendado")?.count || 0
    const emEstoqueQty = statusCounts.find((s) => s.status === "Em Estoque")?.total_quantity || 0
    const embaladoCount = statusCounts.find((s) => s.status === "Embalado")?.count || 0

    const vendidosData = await sql`
      SELECT COALESCE(SUM(quantity * sale_price), 0) as total_vendido
      FROM lots
      WHERE status = 'Vendido'
    `
    const totalVendido = Number.parseFloat(vendidosData[0]?.total_vendido || "0")

    const lotsData = await sql`
      SELECT quantity, cost_price, sale_price
      FROM lots
    `

    const totalCost = lotsData.reduce((sum, lot) => {
      const qty = Number.parseFloat(lot.quantity || "0")
      const cost = Number.parseFloat(lot.cost_price || "0")
      return sum + qty * cost
    }, 0)

    const totalSaleValue = lotsData.reduce((sum, lot) => {
      const qty = Number.parseFloat(lot.quantity || "0")
      const sale = Number.parseFloat(lot.sale_price || "0")
      return sum + qty * sale
    }, 0)

    const profitMargin = totalSaleValue - totalCost

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const expiringLotsResult = await sql`
      SELECT COUNT(*) as count
      FROM lots
      WHERE roast_date IS NOT NULL
        AND roast_date <= ${sixtyDaysAgo.toISOString().split("T")[0]}
    `
    const expiringLots = Number.parseInt(expiringLotsResult[0]?.count || "0")

    const categoryData = await sql`
      SELECT category, COALESCE(SUM(quantity), 0) as total_kg
      FROM lots
      GROUP BY category
    `

    return NextResponse.json({
      encomendadoCount: Number(encomendadoCount),
      emEstoqueQty: Number(emEstoqueQty),
      embaladoCount: Number(embaladoCount),
      totalVendido: Math.round(totalVendido * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalSaleValue: Math.round(totalSaleValue * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      expiringLots,
      categoryData: categoryData.map((c) => ({
        name: c.category,
        value: Number(c.total_kg),
      })),
      statusCounts: statusCounts.map((s) => ({
        status: s.status,
        count: Number(s.count),
      })),
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar estatísticas:", error)

    return NextResponse.json(
      {
        encomendadoCount: 0,
        emEstoqueQty: 0,
        embaladoCount: 0,
        totalVendido: 0,
        totalCost: 0,
        totalSaleValue: 0,
        profitMargin: 0,
        expiringLots: 0,
        categoryData: [],
        statusCounts: [],
        error: "Erro ao carregar estatísticas",
      },
      { status: 200 },
    )
  }
}
