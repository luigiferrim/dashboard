"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle } from 'lucide-react'

export default function VerifyAccessPage() {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Código incorreto")
        setAccessCode("")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("[v0] Erro ao verificar código:", err)
      setError("Erro ao verificar código. Tente novamente.")
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B6F47]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#8B6F47] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verificação de Acesso
            </h1>
            <p className="text-gray-600 text-center">
              Digite o código de acesso do Coxilha Coffee para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Acesso
              </label>
              <input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="••••••"
                maxLength={20}
                autoComplete="off"
                autoFocus
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !accessCode}
              className="w-full bg-[#8B6F47] text-white py-3 rounded-lg font-semibold hover:bg-[#6F5838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Verificar Código"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Segurança:</strong> Você tem 3 tentativas por hora. Após isso, precisará aguardar antes de tentar novamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
