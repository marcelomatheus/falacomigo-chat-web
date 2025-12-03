"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChatListItem } from "@/components/styleguide/chat-list-item"
import { MessageBubble } from "@/components/styleguide/message-bubble"
import { ChatInputArea } from "@/components/styleguide/chat-input-area"
import { ChatHeader } from "@/components/styleguide/chat-header"

export default function StyleguidePage() {
  
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add('dark');
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        <section className="space-y-2 flex flex-col items-start">
          <div className="flex w-full justify-between items-center">
             <h1 className="text-4xl font-bold">Styleguide - Fala Comigo</h1>
             <Button onClick={toggleTheme} variant="outline">
                Alternar Tema (Light/Dark)
             </Button>
          </div>
          <p className="text-muted-foreground">Componentes UI prontos para copiar e colar</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Paleta de Cores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary rounded-lg" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#6A33E9</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-secondary rounded-lg" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#A067D7</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-accent rounded-lg" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">#4285F4</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-card rounded-lg border border-border" />
              <p className="text-sm font-medium">Card</p>
              <p className="text-xs text-muted-foreground">#3a1c61</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Botões</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Botão Primário</Button>
            <Button variant="secondary">Botão Secundário</Button>
            <Button variant="outline">Botão Outline</Button>
            <Button variant="ghost">Botão Ghost</Button>
            <Button variant="destructive">Botão Destrutivo</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Inputs</h2>
          <div className="space-y-3 max-w-sm">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu.email@example.com" className="h-12" />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-12" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Padrão</Badge>
            <Badge variant="secondary">Secundário</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destrutivo</Badge>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatares</h2>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <AvatarFallback>FC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback className="bg-secondary text-secondary-foreground">ML</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Componentes de Chat</h2>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">ChatHeader</p>
            <ChatHeader name="João Silva" status="online" avatarFallback="JS" />
          </div>

          <div className="space-y-2 max-w-sm">
            <p className="text-sm text-muted-foreground">ChatListItem</p>
            <Card className="bg-card border-border p-2">
              <ChatListItem
                name="Maria Santos"
                lastMessage="Ótimo! Vamos começar?"
                avatarFallback="MS"
                isSelected={true}
              />
              <ChatListItem name="Pedro Oliveira" lastMessage="Vejo você depois" avatarFallback="PO" />
              <ChatListItem name="Ana Costa" lastMessage="Que legal essa conversa!" avatarFallback="AC" />
            </Card>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">MessageBubble</p>
            <Card className="bg-card border-border p-4 space-y-3">
              <MessageBubble variant="other" content="Oi! Como você está?" timestamp="10:30" />
              <MessageBubble variant="self" content="Tudo bem! E você?" timestamp="10:31" showAISuggest={true} />
              <MessageBubble variant="other" content="Tudo certo! Quer estudar hoje?" timestamp="10:32" />
            </Card>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-sm text-muted-foreground">ChatInputArea</p>
            <ChatInputArea onSendMessage={(msg) => console.log("Mensagem:", msg)} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary">Card Simples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Este é um card simples com header e content.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-secondary">Card com Badge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">Este card demonstra a integração com badges.</p>
                <Badge className="bg-accent text-accent-foreground">Premium</Badge>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}