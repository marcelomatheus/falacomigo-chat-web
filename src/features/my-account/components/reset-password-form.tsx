"use client";

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPasswordForm } from '@/features/my-account/hooks/use-reset-password-form';
import { useConfirmPasswordReset } from '@/features/my-account/hooks/use-account-security-requests';
import {
  extractBackendErrorMessage,
  translateBackendMessage,
} from '@/features/auth/utils/error-message.utils';
import { useRouter } from 'next/dist/client/components/navigation';
import { useState } from 'react';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const form = useResetPasswordForm();
  const confirmPasswordReset = useConfirmPasswordReset();
  const normalizedToken = token.trim();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await confirmPasswordReset.mutateAsync({
        token: normalizedToken,
        newPassword: values.password,
      });
      console.log('Password reset successful:', response);
      setMessage(translateBackendMessage(
          response.message,
          'Token inválido ou expirado. Solicite um novo link.',
        ),);
      form.reset();
      router.push('/login');
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      setMessage(
        translateBackendMessage(
          backendMessage,
          'Token inválido ou expirado. Solicite um novo link.',
        ),
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && (
        <p className="text-sm text-green-500">{message}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua nova senha"
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Digite novamente"
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-xs text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={confirmPasswordReset.isPending}>
        {confirmPasswordReset.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Atualizando senha...
          </>
        ) : (
          'Atualizar senha'
        )}
      </Button>
    </form>
  );
}
