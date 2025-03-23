
export interface Product {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  imagem_url: string;
}

export type ProductFormValues = {
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  imagem_url: string;
  banner_url: string;
  banner_mobile_url: string;
  banner_color: string;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  usar_config_pix_global: boolean;
};
