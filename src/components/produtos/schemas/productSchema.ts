
import * as z from 'zod';

export const productSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  tipo: z.string().min(1, { message: 'Selecione um tipo de produto' }),
  valor: z.coerce.number().positive({ message: 'Valor deve ser positivo' }),
  descricao: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  ativo: z.boolean().default(true),
  slug: z.string().min(3, { message: 'Slug deve ter pelo menos 3 caracteres' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: 'Slug deve conter apenas letras minúsculas, números e hífens' 
    }),
  checkout_title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  imagem_url: z.string().url({ message: 'URL da imagem inválida' }).optional().or(z.literal('')),
  banner_url: z.string().url({ message: 'URL do banner inválida' }).optional().or(z.literal('')),
  banner_mobile_url: z.string().url({ message: 'URL do banner mobile inválida' }).optional().or(z.literal('')),
  banner_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'Cor deve estar no formato hexadecimal (ex: #FF5733)' 
  }).optional().or(z.literal('')),
  background_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'Cor deve estar no formato hexadecimal (ex: #FFFFFF)' 
  }).optional().or(z.literal('')),
  tipo_chave_pix: z.string().optional(),
  chave_pix: z.string().optional(),
  nome_beneficiario: z.string().optional(),
  usar_api_pix: z.boolean().default(false),
  usar_config_pix_global: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;
