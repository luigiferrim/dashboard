"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Lot {
  id: string
  name: string
  quantity: number
  costPrice: number
  salePrice: number
  category: string
  status: string
}

export default function FinanceiroPage() {
  const [lots, setLots] = useState<Lot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/lots")
      const data = await response.json()
      setLots(data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Cálculos financeiros
  const totalCost = lots.reduce((sum, lot) => sum + lot.quantity * lot.costPrice, 0)
  const totalRevenue = lots.reduce((sum, lot) => sum + lot.quantity * lot.salePrice, 0)
  const soldLots = lots.filter((lot) => lot.status === "Vendido")
  const totalRevenueSold = soldLots.reduce((sum, lot) => sum + lot.quantity * lot.salePrice, 0)
  const totalCostSold = soldLots.reduce((sum, lot) => sum + lot.quantity * lot.costPrice, 0)
  const realProfit = totalRevenueSold - totalCostSold
  const totalProfit = totalRevenue - totalCost
  const profitMargin = totalRevenueSold > 0 ? ((realProfit / totalRevenueSold) * 100).toFixed(1) : "0"

  // Dados por categoria
  const categoryData = lots.reduce((acc: any, lot) => {
    const existing = acc.find((item: any) => item.name === lot.category)
    const value = lot.quantity * lot.salePrice

    if (existing) {
      existing.value += value
    } else {
      acc.push({ name: lot.category, value })
    }
    return acc
  }, [])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground text-sm md:text-base">Análise financeira e rentabilidade</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Custo Total em Estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">Valor investido em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Receita Potencial</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-1">Se vender todo o estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Lucro Realizado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold text-green-600">{formatCurrency(realProfit)}</p>
            <p className="text-xs text-muted-foreground mt-1">De lotes vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Margem de Lucro</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">{profitMargin}%</p>
            <p className="text-xs text-muted-foreground mt-1">Margem sobre vendas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
            <CardDescription className="text-sm">Valor potencial de venda por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos Mais Valiosos</CardTitle>
            <CardDescription className="text-sm">Top 5 lotes por valor total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lots
                .map((lot) => ({
                  ...lot,
                  totalValue: lot.quantity * lot.salePrice,
                }))
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, 5)
                .map((lot, index) => (
                  <div key={lot.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{lot.name}</p>
                        <p className="text-xs text-muted-foreground">{lot.quantity} kg</p>
                      </div>
                    </div>
                    <p className="font-semibold flex-shrink-0">{formatCurrency(lot.totalValue)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise Detalhada por Lote</CardTitle>
          <CardDescription className="text-sm">Lucro individual de cada produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 md:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm">Produto</th>
                  <th className="text-right p-2 text-sm">Qtd</th>
                  <th className="text-right p-2 text-sm">Custo Unit.</th>
                  <th className="text-right p-2 text-sm">Venda Unit.</th>
                  <th className="text-right p-2 text-sm">Lucro/Un.</th>
                  <th className="text-right p-2 text-sm">Lucro Total</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => {
                  const profitPerUnit = lot.salePrice - lot.costPrice
                  const totalProfit = profitPerUnit * lot.quantity

                  return (
                    <tr key={lot.id} className="border-b">
                      <td className="p-2 text-sm">{lot.name}</td>
                      <td className="text-right p-2 text-sm">{lot.quantity}</td>
                      <td className="text-right p-2 text-sm">{formatCurrency(lot.costPrice)}</td>
                      <td className="text-right p-2 text-sm">{formatCurrency(lot.salePrice)}</td>
                      <td className="text-right p-2 text-sm text-green-600">{formatCurrency(profitPerUnit)}</td>
                      <td className="text-right p-2 text-sm font-semibold text-green-600">
                        {formatCurrency(totalProfit)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
