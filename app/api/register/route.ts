import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { hashPassword, validatePasswordStrength } from "@/lib/password"
import { rateLimit } from "@/lib/rate-limit"
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    
    if (!rateLimit(`register:${ip}`, { interval: 15 * 60 * 1000, maxRequests: 5 })) {
      return NextResponse.json(
        { error: "Muitas tentativas de registro. Aguarde 15 minutos e tente novamente." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const sanitizedEmail = sanitizeEmail(email)
    const sanitizedName = sanitizeString(name)
    
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: "Senha fraca",
        details: passwordValidation.errors 
      }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const sql = getDb()

    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${sanitizedEmail} LIMIT 1
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const users = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${sanitizedEmail}, ${hashedPassword}, ${sanitizedName})
      RETURNING id
    `

    const userId = users[0].id

    await sql`
      INSERT INTO logs (user_id, action, details, created_at)
      VALUES (${userId}, 'register', ${`Novo usuário registrado`}, NOW())
    `

    return NextResponse.json({ message: "Usuário criado com sucesso", userId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar usuário" }, { status: 500 })
  }
}
