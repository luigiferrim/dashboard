"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings, Lock, User } from "lucide-react"

export default function ConfiguracoesPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("As senhas não coincidem")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("A nova senha deve ter no mínimo 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || "Erro ao alterar senha")
        return
      }

      setMessage("Senha alterada com sucesso!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setMessage("Erro ao conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Meu Perfil</CardTitle>
            </div>
            <CardDescription className="text-sm">Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={session?.user?.name || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={session?.user?.email || ""} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Alterar Senha</CardTitle>
            </div>
            <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Digite sua senha atual"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                  required
                  minLength={6}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Digite novamente a nova senha"
                  required
                  className="bg-white"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.includes("sucesso")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
