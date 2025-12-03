"use client"

import { useState, FormEvent } from "react"
import { Mail, Lock, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import logoBg from "../../../public/background-login.png"
import logo from "../../../public/logo.png"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (response?.error) {
        setErrorMessage("Credenciais inválidas")
        setIsLoading(false)
      } else {
        router.push("/")
      }
    } catch (error) {
      setErrorMessage("Ocorreu um erro inesperado. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      <div className="bg-[#ceaee6] hidden md:block md:w-3/5 relative min-h-screen">
        <Image
          src={logoBg}
          alt="Ilustração Fala Comigo"
          fill
          className="object-cover object-[center_80%]"
          priority
        />
      </div>

      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-8 md:p-12 space-y-6 bg-card min-h-screen">
        <div className="relative w-28 h-28 mb-2">
          <Image
            src={logo}
            alt="Fala Comigo Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <h3 className="text-secondary font-bold">Fala Comigo</h3>
          <p className="text-sm text-muted-foreground">Conecte-se. Aprenda. Converse.</p>
        </div>

        <div className="space-y-5 w-full">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground mt-1">Faça login para continuar aprendendo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@example.com"
                  className="h-11 pl-10 bg-muted text-foreground border-muted placeholder:text-muted-foreground focus:border-primary"
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 pl-10 bg-muted text-foreground border-muted placeholder:text-muted-foreground focus:border-primary"
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              {/* <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <span className="relative bg-card px-4 text-xs text-muted-foreground">ou continue com</span>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="w-full h-11 border-muted border-0 shadow-none sm:border-0 sm:shadow-none bg-transparent font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </Button> */}
            </div> 
          </form>

          <div className="text-center pt-2">
            <span className="text-sm text-muted-foreground">Ainda não possui conta? </span>

            <Link href="/register">
              <Button
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                Cadastre-se
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}