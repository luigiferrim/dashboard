"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, DollarSign } from "lucide-react"

interface Stats {
  encomendadoCount: number
  emEstoqueQty: number
  embaladoCount: number
  totalVendido: number
  totalCost: number
  totalSaleValue: number
  profitMargin: number
  expiringLots: number
  categoryData: Array<{ name: string; value: number }>
  statusCounts: Array<{ status: string; count: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const statsRes = await fetch("/api/dashboard/stats")
      const statsData = await statsRes.json()
      setStats(statsData)
    } catch (error) {
      console.error("[v0] Erro ao buscar dados:", error)
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

  const categoryData = stats?.categoryData.length
    ? stats.categoryData.map((cat, idx) => ({
        name: cat.name,
        value: cat.value,
        fill: ["rgb(121, 85, 72)", "rgb(230, 224, 217)", "rgb(139, 109, 87)"][idx] || "rgb(180, 165, 155)",
      }))
    : []

  const totalStatusCount = stats?.statusCounts.reduce((sum, s) => sum + s.count, 0) || 1
  const statusData = stats?.statusCounts.length
    ? stats.statusCounts.map((s) => {
        const fills: Record<string, string> = {
          Encomendado: "rgb(59, 130, 246)",
          Chegou: "rgb(168, 85, 247)",
          "Em Estoque": "rgb(34, 197, 94)",
          Embalado: "rgb(249, 115, 22)",
          Vendido: "rgb(156, 163, 175)",
        }
        return {
          name: s.status,
          value: Math.round((s.count / totalStatusCount) * 100),
          fill: fills[s.status] || "rgb(121, 85, 72)",
        }
      })
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  const profitMarginPercent =
    stats?.totalSaleValue && stats.totalSaleValue > 0
      ? ((stats.profitMargin / stats.totalSaleValue) * 100).toFixed(1)
      : "0"

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Acompanhe as métricas mais importantes do seu negócio.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-border bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Cafés encomendados</p>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.encomendadoCount || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Cafés em estoque</p>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.emEstoqueQty || 0} kg</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Cafés embalados</p>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.embaladoCount || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Cafés vendidos</p>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats?.totalVendido || 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Kg por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <div className="flex items-end justify-between h-64 gap-8 px-4">
                  {categoryData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className="w-full rounded-t-lg transition-all hover:opacity-80"
                        style={{
                          backgroundColor: item.fill,
                          height: `${(item.value / Math.max(...categoryData.map((d) => d.value))) * 100}%`,
                          minHeight: "60px",
                        }}
                      />
                      <p className="text-sm font-medium text-foreground mt-3">{item.name}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-2xl font-bold text-foreground">
                    {categoryData.reduce((sum, d) => sum + d.value, 0)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">Total em estoque</p>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Nenhum dado disponível</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {statusData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-2xl font-bold text-foreground">{totalStatusCount}</p>
                  <p className="text-sm text-muted-foreground">Total de lotes</p>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Nenhum dado disponível</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Resumo Financeiro</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Valor Total Investido</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(stats?.totalCost || 0)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Receita Total Potencial</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(stats?.totalSaleValue || 0)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Lucro Líquido Acumulado</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(stats?.profitMargin || 0)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
