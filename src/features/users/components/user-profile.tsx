"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileWithUser } from "../interface/profile.interface";
import { MessageCircle, ArrowLeft, Mail, Globe, Award, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_NAMES } from "../constants";
import { getInitials } from "@/lib/utils/string.utils";

interface UserProfileProps {
  profile: ProfileWithUser;
  onStartChat: () => void;
  onBack?: () => void;
  className?: string;
}

export function UserProfile({
  profile,
  onStartChat,
  onBack,
  className,
}: UserProfileProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-lg font-semibold">Perfil do Usuário</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                {profile.photoUrl ? (
                  <AvatarImage src={profile.photoUrl} alt={profile.name} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                {profile.user?.email && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{profile.user.email}</span>
                  </div>
                )}
              </div>

              <Button onClick={onStartChat} className="w-full max-w-xs">
                <MessageCircle className="h-4 w-4 mr-2" />
                Iniciar Conversa
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Aprendizado de Idiomas
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.learningLang ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Está aprendendo:
                </span>
                <Badge variant="secondary" className="text-sm">
                  {LANGUAGE_NAMES[profile.learningLang] || profile.learningLang.toUpperCase()}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum idioma de aprendizado definido
              </p>
            )}

            {profile.learningLevel && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Nível:
                </span>
                <Badge variant="outline" className="text-sm">
                  {profile.learningLevel}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {profile.knownLanguages && profile.knownLanguages.length > 0 && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold">Idiomas que Fala</h4>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.knownLanguages.map((lang) => (
                  <Badge key={lang} variant="default" className="text-sm">
                    {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Informações Adicionais</h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membro desde:
              </span>
              <span className="text-sm">{formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Saldo de tokens:
              </span>
              <Badge variant="secondary">{profile.tokensBalance}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Conversas ativas:
              </span>
              <span className="text-sm font-semibold">{profile.chatIds?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Última atualização:
              </span>
              <span className="text-sm">{formatDate(profile.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
