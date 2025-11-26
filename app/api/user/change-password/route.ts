import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/password"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    if (!rateLimit(`change-password:${session.user.email}`, { interval: 15 * 60 * 1000, maxRequests: 5 })) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde 15 minutos e tente novamente." },
        { status: 429 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: "Nova senha não atende aos requisitos de segurança",
        details: passwordValidation.errors 
      }, { status: 400 })
    }

    const sql = getDb()

    // Buscar usuário
    const users = await sql`
      SELECT id, password FROM users WHERE email = ${session.user.email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]

    // Verificar senha atual
    const isValidPassword = await verifyPassword(currentPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword)

    // Atualizar senha no banco
    await sql`
      UPDATE users SET password = ${hashedPassword} WHERE id = ${user.id}
    `

    // Registrar log
    await sql`
      INSERT INTO logs (action, details, user_id)
      VALUES ('change_password', 'Usuário alterou sua senha', ${user.id})
    `

    return NextResponse.json({ success: true, message: "Senha alterada com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao alterar senha" }, { status: 500 })
  }
}
