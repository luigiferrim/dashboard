import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
    accessVerified?: boolean
  }

  interface User {
    id: string
    email: string
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessVerified?: boolean
  }
}
