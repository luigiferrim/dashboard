"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/estoque", label: "Estoque" },
    { href: "/financeiro", label: "Financeiro" },
    { href: "/historico", label: "Histórico" },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Sistema Estoque
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {session?.user?.name || "Usuário"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
