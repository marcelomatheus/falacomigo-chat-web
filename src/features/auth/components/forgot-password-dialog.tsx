"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

type ForgotPasswordDialogProps = {
  initialEmail?: string;
};

export function ForgotPasswordDialog({
  initialEmail = '',
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(initialEmail);
  const [statusMessage, setStatusMessage] = useState('');

  const requestPasswordReset = useRequestPasswordReset();

  const handleRequestReset = async () => {
    if (!email) {
      setStatusMessage('Informe seu email para solicitar a redefinição de senha.');
      return;
    }

    try {
      const response = await requestPasswordReset.mutateAsync(email);
      setStatusMessage(response.message);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      setStatusMessage(
        translateBackendMessage(
          backendMessage,
          'Não foi possível solicitar a redefinição de senha. Tente novamente.',
        ),
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="w-full text-sm p-0 h-auto">
          Esqueci minha senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Esqueci minha senha</DialogTitle>
          <DialogDescription>
            Informe seu email para receber o link de redefinição de senha.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-password-email">Email</Label>
            <Input
              id="forgot-password-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Seu email"
            />
          </div>

          {statusMessage ? (
            <p className="text-xs text-center text-muted-foreground">{statusMessage}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
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
              'Solicitar redefinição'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
