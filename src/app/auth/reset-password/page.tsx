import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { ResetPasswordForm } from '@/features/my-account/components/reset-password-form';

import logoBg from '../../../../public/background-login.png';
import logo from '../../../../public/logo.png';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token: rawToken = '' } = await searchParams;

  const token = (() => {
    const safeToken = String(rawToken || '').trim();
    try {
      return decodeURIComponent(safeToken);
    } catch {
      return safeToken;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      <div className="bg-[#ceaee6] hidden md:block md:w-3/5 relative min-h-screen">
        <Image
          src={logoBg}
          alt="Ilustração Fala Comigo"
          fill
          className="object-cover object-[center_80%]"
          priority
        />
      </div>

      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-8 md:p-12 space-y-6 bg-card min-h-screen">
        <div className="relative w-28 h-28 mb-2">
          <Image
            src={logo}
            alt="Fala Comigo Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <h3 className="text-secondary font-bold">Fala Comigo</h3>
          <p className="text-sm text-muted-foreground">Recupere sua conta com segurança.</p>
        </div>

        <div className="space-y-5 w-full">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Redefinir senha</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Digite sua nova senha para concluir a recuperação da conta.
            </p>
          </div>

          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Link inválido. Solicite um novo email de redefinição de senha.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Voltar para login
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <span className="text-sm text-muted-foreground">Lembrou sua senha? </span>
            <Link href="/login" className="text-sm text-primary hover:text-primary/80 font-medium hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
