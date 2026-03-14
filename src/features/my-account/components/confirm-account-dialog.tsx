"use client";

import { toast } from 'react-toastify';
import { Loader2, MailCheck } from 'lucide-react';

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
import { useConfirmAccountForm } from '@/features/my-account/hooks/use-confirm-account-form';
import {
  useRequestAccountConfirmation,
  useResendAccountConfirmation,
  useVerifyAccountConfirmation,
} from '@/features/my-account/hooks/use-account-security-requests';
import {
  extractBackendErrorMessage,
  translateBackendMessage,
} from '@/features/auth/utils/error-message.utils';

type ConfirmAccountDialogProps = {
  email: string;
};

export function ConfirmAccountDialog({ email }: ConfirmAccountDialogProps) {
  const form = useConfirmAccountForm();

  const requestCode = useRequestAccountConfirmation();
  const resendCode = useResendAccountConfirmation();
  const verifyCode = useVerifyAccountConfirmation();

  const handleSendCode = async () => {
    try {
      const response = await requestCode.mutateAsync(email);
      toast.success(response.message);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      toast.error(
        translateBackendMessage(
          backendMessage,
          'Não foi possível enviar o código de confirmação.',
        ),
      );
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode.mutateAsync(email);
      toast.success(response.message);
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      toast.error(
        translateBackendMessage(
          backendMessage,
          'Não foi possível reenviar o código.',
        ),
      );
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await verifyCode.mutateAsync({
        email,
        code: values.code,
      });
      toast.success(response.message);
      form.reset();
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      toast.error(
        translateBackendMessage(backendMessage, 'Código inválido ou expirado.'),
      );
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <MailCheck className="mr-2 h-4 w-4" />
          Confirmar conta
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar conta</DialogTitle>
          <DialogDescription>
            Enviaremos um código de 6 dígitos para o email cadastrado e você poderá
            validar sua conta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled className="bg-muted/50" />
          </div>

          <Button
            type="button"
            onClick={handleSendCode}
            disabled={requestCode.isPending}
            className="w-full"
          >
            {requestCode.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar código'
            )}
          </Button>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="code">Código de confirmação</Label>
              <Input
                id="code"
                maxLength={6}
                placeholder="000000"
                {...form.register('code')}
              />
              {form.formState.errors.code ? (
                <p className="text-xs text-red-500">
                  {form.formState.errors.code.message}
                </p>
              ) : null}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={resendCode.isPending}
              >
                {resendCode.isPending ? 'Reenviando...' : 'Reenviar código'}
              </Button>

              <Button type="submit" disabled={verifyCode.isPending}>
                {verifyCode.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar código'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
