"use client";

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useResendAccountConfirmation,
  useVerifyAccountConfirmation,
} from '@/features/my-account/hooks/use-account-security-requests';
import {
  extractBackendErrorMessage,
  translateBackendMessage,
} from '@/features/auth/utils/error-message.utils';

type LoginConfirmAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirmed: () => Promise<void>;
};

const RESEND_COOLDOWN_SECONDS = 90;

export function LoginConfirmAccountDialog({
  open,
  onOpenChange,
  email,
  onConfirmed,
}: LoginConfirmAccountDialogProps) {
  const [code, setCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const resendCode = useResendAccountConfirmation();
  const verifyCode = useVerifyAccountConfirmation();

  useEffect(() => {
    if (!open) {
      return;
    }

    setCode('');
    setResendCooldown(0);
    setStatusMessage(
      'Enviamos um código para seu email na tentativa de login. Verifique sua caixa de entrada.',
    );
  }, [open]);

  useEffect(() => {
    if (!open || resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, resendCooldown]);

  const resendLabel = useMemo(() => {
    if (resendCooldown > 0) {
      return `Enviar código (${resendCooldown}s)`;
    }

    return 'Enviar código';
  }, [resendCooldown]);

  const handleSendCode = async () => {
    try {
      const response = await resendCode.mutateAsync(email);

      setStatusMessage(response.message);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      setStatusMessage(
        translateBackendMessage(
          backendMessage,
          'Não foi possível enviar o código. Tente novamente.',
        ),
      );
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setStatusMessage('Informe o código completo com 6 dígitos.');
      return;
    }

    try {
      const response = await verifyCode.mutateAsync({ email, code });
      setStatusMessage(response.message);
      setIsSigningIn(true);
      await onConfirmed();
      onOpenChange(false);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      setStatusMessage(
        translateBackendMessage(
          backendMessage,
          'Código de confirmação inválido ou expirado.',
        ),
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar conta</DialogTitle>
          <DialogDescription>
            Para entrar, confirme seu email com o código enviado agora.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-confirm-email">Email</Label>
            <Input
              id="login-confirm-email"
              value={email}
              disabled
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-confirm-code">Código de confirmação</Label>
            <Input
              id="login-confirm-code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              maxLength={6}
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>

          {statusMessage ? (
            <p className="text-xs text-center text-muted-foreground">{statusMessage}</p>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSendCode}
            disabled={resendCode.isPending || resendCooldown > 0}
          >
            {resendCode.isPending ? 'Enviando...' : resendLabel}
          </Button>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={verifyCode.isPending || isSigningIn}
          >
            {verifyCode.isPending || isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              'Confirmar e entrar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
