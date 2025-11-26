"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Log {
  id: string
  action: string
  details: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
  lot: {
    name: string
  } | null
}

export default function HistoricoPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    let filtered = logs

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.lot?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por tipo de ação
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    setFilteredLogs(filtered)
  }, [searchTerm, actionFilter, logs])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs")
      const data = await response.json()
      setLogs(data)
      setFilteredLogs(data)
    } catch (error) {
      console.error("Erro ao buscar logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: "Login",
      logout: "Logout",
      register: "Registro",
      create_lot: "Criar Lote",
      update_lot: "Atualizar Lote",
      delete_lot: "Deletar Lote",
    }
    return labels[action] || action
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: "bg-blue-500/10 text-blue-600",
      logout: "bg-gray-500/10 text-gray-600",
      register: "bg-green-500/10 text-green-600",
      create_lot: "bg-green-500/10 text-green-600",
      update_lot: "bg-yellow-500/10 text-yellow-600",
      delete_lot: "bg-red-500/10 text-red-600",
    }
    return colors[action] || "bg-gray-500/10 text-gray-600"
  }

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Histórico de Auditoria</h1>
        <p className="text-muted-foreground text-sm md:text-base">Registro completo de todas as ações no sistema</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por usuário, detalhes ou lote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="register">Registro</SelectItem>
            <SelectItem value="create_lot">Criar Lote</SelectItem>
            <SelectItem value="update_lot">Atualizar Lote</SelectItem>
            <SelectItem value="delete_lot">Deletar Lote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Atividades</CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? "evento" : "eventos"} encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-sm text-muted-foreground">por {log.user.name}</span>
                  </div>
                  {log.details && <p className="text-sm">{log.details}</p>}
                  {log.lot && <p className="text-xs text-muted-foreground">Lote: {log.lot.name}</p>}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchTerm || actionFilter !== "all"
                    ? "Nenhum registro encontrado com os filtros aplicados"
                    : "Nenhum registro de auditoria ainda"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total de Eventos</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Lotes Criados</p>
              <p className="text-2xl font-bold">{logs.filter((log) => log.action === "create_lot").length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Lotes Deletados</p>
              <p className="text-2xl font-bold">{logs.filter((log) => log.action === "delete_lot").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
