"use client";

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MailCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useRequestAccountConfirmation,
  useResendAccountConfirmation,
  useVerifyAccountConfirmation,
} from '@/features/my-account/hooks/use-account-security-requests';
import {
  extractBackendErrorMessage,
  translateBackendMessage,
} from '@/features/auth/utils/error-message.utils';

function ConfirmAccountContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const fromRegister = searchParams.get('fromRegister') === 'true';

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const requestCode = useRequestAccountConfirmation();
  const resendCode = useResendAccountConfirmation();
  const verifyCode = useVerifyAccountConfirmation();

  const handleSendCode = async () => {
    if (!email) {
      toast.error('Informe seu email para receber o código.');
      return;
    }

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
    if (!email) {
      toast.error('Informe seu email para reenviar o código.');
      return;
    }

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

  const handleVerify = async () => {
    if (!email || !code) {
      toast.error('Informe email e código para validar.');
      return;
    }

    try {
      const response = await verifyCode.mutateAsync({ email, code });
      toast.success(response.message);
      setCode('');
    } catch (error) {
      const backendMessage = extractBackendErrorMessage(error);
      toast.error(
        translateBackendMessage(backendMessage, 'Código inválido ou expirado.'),
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailCheck className="h-5 w-5" />
              Confirmar conta
            </CardTitle>
            <CardDescription>
              Confirme seu cadastro para liberar o login na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fromRegister ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                Cadastro realizado! O código de confirmação foi enviado para seu email. Informe o código abaixo para confirmar sua conta.
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu.email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código de 6 dígitos</Label>
              <Input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSendCode}
                disabled={requestCode.isPending}
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

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResendCode}
                disabled={resendCode.isPending}
              >
                {resendCode.isPending ? 'Reenviando...' : 'Reenviar código'}
              </Button>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleVerify}
              disabled={verifyCode.isPending}
            >
              {verifyCode.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                'Validar conta'
              )}
            </Button>

            <Link href="/login">
              <Button variant="link" className="w-full">
                Voltar para login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background p-4 sm:p-8" />}>
      <ConfirmAccountContent />
    </Suspense>
  );
}
