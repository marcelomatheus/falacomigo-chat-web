"use client";

import { useEffect, useState } from "react";
import { useMyProfile, useUpdateProfile } from "@/features/users/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Adicionei Moon e Sun aos imports
import { Loader2, Save, Coins, Globe, Award, Moon, Sun } from "lucide-react";
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "@/features/users/constants";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function AccountForm() {
    const { data: profile, isLoading } = useMyProfile();
    const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

    const [name, setName] = useState<string>("");
    const [learningLang, setLearningLang] = useState<string>("");
    const [learningLevel, setLearningLevel] = useState<string>("");
    const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
    
    // Estado para controlar o tema
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        if (profile) {
            setName(profile.name)
            setLearningLang(profile.learningLang || "");
            setLearningLevel(profile.learningLevel || "");
            setKnownLanguages(profile.knownLanguages || []);
        }

        // Verifica o tema atual ao carregar
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);
    }, [profile]);

    // Função para alternar o tema
    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            html.classList.add("dark");
            setIsDarkMode(true);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            await updateProfile({
                id: profile.id,
                data: {
                    name: name,
                    learningLang: learningLang || null,
                    learningLevel: learningLevel || null,
                    knownLanguages,
                },
            });
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar perfil.");
        }
    };

    const toggleKnownLanguage = (langValue: string) => {
        setKnownLanguages((prev) =>
            prev.includes(langValue)
                ? prev.filter((l) => l !== langValue)
                : [...prev, langValue]
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center p-8 text-muted-foreground">Não foi possível carregar o perfil.</div>;
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 p-4 pb-24 animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
                    <AvatarImage src={profile.photoUrl || undefined} alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials(profile.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <div className="flex items-center justify-center gap-2 px-3 py-1 bg-secondary/10 rounded-full w-fit mx-auto">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-primary">{profile.tokensBalance}</span>
                        <span className="text-xs text-muted-foreground">tokens</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Dados da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome de exibição</Label>
                            <Input 
                                value={name}
                                className="bg-muted/50"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {session?.user?.email && (
                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input value={session?.user.email} disabled className="bg-muted/50" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Preferências de Aprendizado</CardTitle>
                        <CardDescription>Configure seus idiomas para encontrar parceiros ideais.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-primary" />
                                    Quero aprender
                                </Label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={learningLang}
                                        onChange={(e) => setLearningLang(e.target.value)}
                                    >
                                        <option value="">Selecione um idioma...</option>
                                        {LANGUAGE_OPTIONS.map((lang) => (
                                            <option key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    Meu nível atual
                                </Label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={learningLevel}
                                        onChange={(e) => setLearningLevel(e.target.value)}
                                    >
                                        <option value="">Selecione seu nível...</option>
                                        {LEVEL_OPTIONS.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Idiomas que já falo</Label>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGE_OPTIONS.map((lang) => {
                                    const isSelected = knownLanguages.includes(lang.value);
                                    return (
                                        <Badge
                                            key={lang.value}
                                            variant={isSelected ? "default" : "outline"}
                                            className={cn(
                                                "cursor-pointer px-3 py-1.5 transition-all hover:scale-105 active:scale-95",
                                                !isSelected && "hover:bg-accent hover:text-accent-foreground opacity-70 hover:opacity-100"
                                            )}
                                            onClick={() => toggleKnownLanguage(lang.value)}
                                        >
                                            {lang.label}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Novo Card de Aparência */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Aparência</CardTitle>
                        <CardDescription>Personalize a experiência visual do aplicativo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label>Tema do aplicativo</Label>
                            <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2">
                                {isDarkMode ? (
                                    <>
                                        <Sun className="h-4 w-4" />
                                        Modo Claro
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-4 w-4" />
                                        Modo Escuro
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-12 text-base font-semibold shadow-md"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-5 w-5" />
                        Salvar Alterações
                    </>
                )}
            </Button>
        </div>
    );
}