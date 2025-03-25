
export interface Product {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  checkout_button_text?: string | null;
  imagem_url: string | null;
  banner_url?: string | null;
  banner_mobile_url?: string | null;
  banner_color?: string | null;
  background_color?: string | null;
  tipo_chave_pix?: string | null;
  chave_pix?: string | null;
  nome_beneficiario?: string | null;
  usar_api_pix?: boolean;
  usar_config_pix_global?: boolean;
  url_pix_api?: string | null;
  url_api_pix?: string | null;
  criado_em?: string;
}

export type ProductFormValues = {
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  checkout_button_text?: string;
  imagem_url: string;
  banner_url: string;
  banner_mobile_url: string;
  banner_color: string;
  background_color: string;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  usar_config_pix_global: boolean;
  url_api_pix?: string;
  url_pix_api?: string;
};
