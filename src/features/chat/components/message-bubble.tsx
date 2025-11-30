"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessageBubbleProps } from "../interface/component-props.interface";
import { Sparkles, X, Loader2, ArrowRight } from "lucide-react"; 
import { useInterpretMessage } from "../hooks/useMessage";
import { InterpretResponse, Translation, CorrectionSuggestion } from "../interface/message.interface";

export function MessageBubble({
  content,
  senderId,
  currentProfileId,
  senderName,
  senderPhoto,
  timestamp,
  translation: initialTranslation,
  correctionSuggestions: initialCorrection,
  status = 'sent',
  onRequestTranslation,
  onRequestCorrection,
  className,
  ...props 
}: ChatMessageBubbleProps & { id?: string; chatId?: string }) {
  const isOwnMessage = senderId === currentProfileId;
  const timeString = new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { mutateAsync: interpret, isPending: isAnalyzing } = useInterpretMessage();
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [fetchedData, setFetchedData] = useState<InterpretResponse | null>(null);

  const translationData = (fetchedData?.translation || initialTranslation) as Translation | null;
  const correctionData = (fetchedData?.correctionSuggestions || initialCorrection) as CorrectionSuggestion | null;
  
  const messageId = props.id || (props as any).messageId;
  const chatId = props.chatId;

  const handleAnalysisClick = async () => {
    setShowAnalysisModal(true);

    if ((initialTranslation || initialCorrection) || fetchedData) {
      return;
    }

    if (messageId && content && chatId) {
      try {
        const result = await interpret({
          content,
          senderId,
          messageId,
          chatId
        });
        setFetchedData(result);
      } catch (error) {
        console.error("Failed to interpret message", error);
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div
        className={cn(
          "flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 group",
          isOwnMessage ? "flex-row-reverse" : "flex-row",
          className
        )}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
            {senderPhoto ? (
              <AvatarImage src={senderPhoto} alt={senderName} />
            ) : null}
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              {getInitials(senderName)}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "flex flex-col gap-1 max-w-[75%] sm:max-w-[60%]",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
          {!isOwnMessage && senderName && (
            <span className="text-xs text-muted-foreground px-3">
              {senderName}
            </span>
          )}

          <div className="flex items-end gap-2">
            {/* MUDANÇA AQUI:
              O container da mensagem agora vem PRIMEIRO no código.
              Como o flex é padrão (row), o que vem primeiro fica na esquerda.
              
              Ordem visual resultante: [Mensagem] [Botão]
            */}

            <div
              className={cn(
                "rounded-2xl px-4 py-2 shadow-sm relative",
                isOwnMessage
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm"
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>

              {translationData && !showAnalysisModal && (
                <div className="mt-2 pt-2 border-t border-primary-foreground/20">
                  <Badge variant="outline" className="mb-1 text-xs border-primary-foreground/30 text-current">
                    Tradução
                  </Badge>
                  <p className="text-xs opacity-90">
                    {translationData.translatedText}
                  </p>
                </div>
              )}

              <div
                className={cn(
                  "text-[10px] mt-1 flex items-center gap-1",
                  isOwnMessage
                    ? "justify-end opacity-80"
                    : "justify-start text-muted-foreground"
                )}
              >
                <span>{timeString}</span>
                {isOwnMessage && status === 'pending' && (
                  <span className="uppercase text-[9px] tracking-wide">
                    Enviando...
                  </span>
                )}
              </div>
            </div>

            {/* Botão de Análise (Agora DEPOIS da mensagem) */}
            {isOwnMessage && status !== 'pending' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary"
                onClick={handleAnalysisClick}
                title="Analisar mensagem"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Análise - Mantido igual */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card shadow-xl border-border relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 h-8 w-8 z-10"
              onClick={() => setShowAnalysisModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Análise da Mensagem
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Gerando correções e sugestões com IA...
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original</span>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      {content}
                    </div>
                  </div>

                  {translationData ? (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        Tradução 
                        {translationData.targetLanguage && <Badge variant="secondary" className="text-[10px] h-4 px-1">{translationData.targetLanguage}</Badge>}
                      </span>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                        <p className="font-medium text-foreground">{translationData.translatedText}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Nenhuma tradução disponível.</p>
                  )}

                  {correctionData ? (
                     <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sugestão de Correção</span>
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-2">
                        <div className="flex items-start gap-2">
                           <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                           <p className="font-medium text-green-900 dark:text-green-100">{correctionData.suggestionText}</p>
                        </div>
                        {correctionData.reason && (
                          <p className="text-xs text-muted-foreground pl-6 border-l-2 border-green-500/30 ml-1">
                            {correctionData.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Nenhuma correção necessária.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}