"use client";

import { toast } from 'react-toastify';
import { KeyRound, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequestPasswordReset } from '@/features/my-account/hooks/use-account-security-requests';
import {
  extractBackendErrorMessage,
  translateBackendMessage,
} from '@/features/auth/utils/error-message.utils';

type RequestResetPasswordDialogProps = {
  email: string;
};

export function RequestResetPasswordDialog({
  email,
}: RequestResetPasswordDialogProps) {
  const requestPasswordReset = useRequestPasswordReset();

  const handleRequestReset = async () => {
    try {
      const response = await requestPasswordReset.mutateAsync(email);
      toast.success(response.message);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      toast.error(
        translateBackendMessage(
          backendMessage,
          'Não foi possível solicitar a redefinição de senha.',
        ),
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <KeyRound className="mr-2 h-4 w-4" />
          Redefinir senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar redefinição de senha</DialogTitle>
          <DialogDescription>
            Enviaremos um link seguro para você criar uma nova senha.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled className="bg-muted/50" />
          </div>

          <Button
            className="w-full"
            onClick={handleRequestReset}
            disabled={requestPasswordReset.isPending}
          >
            {requestPasswordReset.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando link...
              </>
            ) : (
              'Enviar link de redefinição'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
