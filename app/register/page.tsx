"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Coffee, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao registrar")
        setLoading(false)
        return
      }

      router.push("/login?registered=true")
    } catch (err) {
      setError("Erro ao registrar. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Coffee className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
            <p className="text-muted-foreground mt-1">Preencha os dados abaixo</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nome Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Insira seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="pl-10 h-12 bg-white border-border text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Insira seu endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="pl-10 h-12 bg-white border-border text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Criar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pl-10 pr-10 h-12 bg-white border-border text-foreground placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#d2691e] hover:bg-[#b8581a] text-white text-base font-medium"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
