"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Coffee, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Erro ao fazer login")
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
            <h1 className="text-2xl font-bold text-foreground">Coxilha Coffee</h1>
            <p className="text-muted-foreground mt-1">Acesse sua conta</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
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
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
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
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary underline underline-offset-4">
              Esqueci minha senha
            </Link>
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Criar nova conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
