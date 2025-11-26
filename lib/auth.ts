import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getDb } from "@/lib/db"
import { verifyPassword, hashPassword } from "@/lib/password"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios")
        }

        const sql = getDb()

        const users = await sql`
          SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
        `

        const user = users[0]

        if (!user) {
          throw new Error("Credenciais inválidas")
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas")
        }

        // Verificar se é formato antigo (SHA-256 sem salt)
        if (!user.password.includes(':')) {
          console.log('[v0] Migrando senha antiga para formato PBKDF2 seguro')
          const newHash = await hashPassword(credentials.password)
          
          await sql`
            UPDATE users 
            SET password = ${newHash}
            WHERE id = ${user.id}
          `
          
          // Log de migração
          await sql`
            INSERT INTO logs (user_id, action, details, created_at)
            VALUES (${user.id}, 'security', 'Senha migrada para formato PBKDF2 seguro', NOW())
          `
        }

        // Log de login
        await sql`
          INSERT INTO logs (user_id, action, details, created_at)
          VALUES (${user.id}, 'login', 'Usuário fez login', NOW())
        `

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessVerified = false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.accessVerified = token.accessVerified || false
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
}
