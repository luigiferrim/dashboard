import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { applyRateLimit } from "@/lib/rate-limit"
import { getDb } from "@/lib/db"

// Rate limit extremamente restrito: 3 tentativas por hora
const rateLimiter = applyRateLimit({
  interval: 60 * 60 * 1000, // 1 hora
  uniqueTokenPerInterval: 500,
})

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    // Rate limiting agressivo por IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    
    try {
      await rateLimiter.check(3, ip) // Máximo 3 tentativas por hora
    } catch {
      const sql = getDb()
      await sql`
        INSERT INTO logs (user_id, action, details, created_at)
        VALUES (
          ${parseInt(session.user.id)},
          'security_alert',
          'Múltiplas tentativas de código de acesso falhadas do IP: ${ip}',
          NOW()
        )
      `
      
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde 1 hora antes de tentar novamente." },
        { status: 429 }
      )
    }

    const { accessCode } = await req.json()

    if (!accessCode || typeof accessCode !== "string") {
      return NextResponse.json(
        { error: "Código de acesso é obrigatório" },
        { status: 400 }
      )
    }

    // Código mestre armazenado em variável de ambiente
    const masterCode = process.env.MASTER_ACCESS_CODE

    if (!masterCode) {
      console.error("[SECURITY] MASTER_ACCESS_CODE não configurado!")
      return NextResponse.json(
        { error: "Sistema de verificação não configurado" },
        { status: 500 }
      )
    }

    // Comparação timing-safe para evitar timing attacks
    const isValid = timingSafeEqual(
      Buffer.from(accessCode.trim()),
      Buffer.from(masterCode)
    )

    const sql = getDb()

    if (!isValid) {
      // Log de tentativa falhada
      await sql`
        INSERT INTO logs (user_id, action, details, created_at)
        VALUES (
          ${parseInt(session.user.id)},
          'access_denied',
          'Tentativa de acesso com código incorreto do IP: ${ip}',
          NOW()
        )
      `

      return NextResponse.json(
        { error: "Código de acesso incorreto" },
        { status: 403 }
      )
    }

    // Log de acesso concedido
    await sql`
      INSERT INTO logs (user_id, action, details, created_at)
      VALUES (
        ${parseInt(session.user.id)},
        'access_granted',
        'Acesso ao sistema concedido com código mestre',
        NOW()
      )
    `

    const response = NextResponse.json({ 
      success: true,
      message: "Acesso concedido"
    })

    // Definir cookie seguro que expira em 24 horas
    response.cookies.set('access_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })

    return response

  } catch (error) {
    console.error("[ERROR] Erro ao verificar código de acesso:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Função de comparação timing-safe
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }
  
  return result === 0
}
