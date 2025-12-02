"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLearnings, useDeleteLearning } from "./hooks/useLearning";
import { LearningItem } from "./interface/learning.interface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Search, Loader2, Trash2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface LearningFeatureProps {
  onBack: () => void;
  className?: string;
}

export default function LearningFeature({ onBack, className }: LearningFeatureProps) {
  const { data: session } = useSession();
  const profileId = session?.user?.profile?.id;

  // Estados de Filtro e Paginação
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Estados de Modal
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reseta para pág 1 ao buscar
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Query
  const { data: learningData, isLoading, isPlaceholderData } = useLearnings({
    profileId: profileId || "",
    title: debouncedSearch || undefined,
    page,
    limit: LIMIT,
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  // Mutation
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteLearning();

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete);
      toast.success("Aprendizado removido com sucesso");
      setItemToDelete(null);
      // Se era o item aberto no modal, fecha o modal também
      if (selectedItem?.id === itemToDelete) setSelectedItem(null);
    } catch (error) {
      toast.error("Erro ao remover item");
    }
  };

  if (!profileId) return null;

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Meus Aprendizados
        </h2>
      </div>

      <div className="p-4 bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : learningData?.data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum aprendizado encontrado.
          </div>
        ) : (
          learningData?.data.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors group relative"
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita abrir o modal
                    setItemToDelete(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {learningData && learningData.totalPages > 1 && (
        <div className="p-4 border-t border-border flex justify-between items-center bg-card">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {learningData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isPlaceholderData && page < learningData.totalPages) {
                setPage((old) => old + 1);
              }
            }}
            disabled={isPlaceholderData || page === learningData.totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">{selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Criado em {selectedItem && new Date(selectedItem.createdAt).toLocaleDateString("pt-BR")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Explicação</h4>
              <div className="p-3 bg-muted/50 rounded-lg text-sm leading-relaxed">
                {selectedItem?.explanation}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Exemplo</h4>
              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-sm italic">
                "{selectedItem?.example}"
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aprendizado?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente este registro de seus estudos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}