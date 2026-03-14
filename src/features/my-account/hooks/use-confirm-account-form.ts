import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const confirmationSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Informe um código com 6 dígitos'),
});

export type ConfirmAccountFormValues = z.infer<typeof confirmationSchema>;

export const useConfirmAccountForm = () => {
  return useForm<ConfirmAccountFormValues>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      code: '',
    },
  });
};
