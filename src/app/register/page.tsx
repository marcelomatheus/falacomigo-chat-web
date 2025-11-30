"use client"

import { useState, FormEvent } from "react"
import { Mail, Lock, Loader2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import logoBg from "../../../public/background-login.png"
import logo from "../../../public/logo.png"
import { registerAction } from "@/lib/api/auth"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string


        if (password.length < 8) {
            setErrorMessage("A senha deve ter pelo menos 8 dígitos")
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("As senhas não coincidem")
            setIsLoading(false)
            return
        }

        registerAction({ name, email, password })
            .then(() => router.push("/login"))
            .catch((_error) => {
                setErrorMessage("Houve um erro realizando seu cadastro. Tente novamente!")
                setTimeout(() => {
                    setErrorMessage("")
                }, 3000)
            })
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
                    <p className="text-sm text-muted-foreground">Crie sua conta e comece a conversar.</p>
                </div>

                <div className="space-y-5 w-full">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Crie sua conta</h2>
                        <p className="text-sm text-muted-foreground mt-1">Preencha os dados abaixo para se cadastrar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                Nome
                            </Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    className="h-11 pl-10 bg-muted text-foreground border-muted placeholder:text-muted-foreground focus:border-primary"
                                    required
                                    disabled={isLoading}
                                />
                                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>

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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirmar Senha
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
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
                                        Criando conta...
                                    </>
                                ) : (
                                    "Cadastrar"
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <span className="text-sm text-muted-foreground">Já possui uma conta? </span>
                        <Link href="/login" className="text-sm text-primary hover:text-primary/80 font-medium hover:underline">
                            Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
