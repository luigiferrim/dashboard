import Link from "next/link"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center">
            <Coffee className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Coxilha Coffee</h1>
            <p className="text-muted-foreground mt-1">Painel de Gestão</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Entrar
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button size="lg" variant="outline" className="w-full bg-transparent">
              Criar Conta
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Sistema de gestão completo para controle de estoque, vendas e finanças
        </p>
      </div>
    </div>
  )
}
