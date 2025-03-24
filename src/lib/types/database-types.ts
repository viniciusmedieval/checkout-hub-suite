
// Types for our database tables
export type Cliente = {
  id: number;
  nome: string;
  email: string;
  celular: string;
  documento: string;
  produto_id: number;
  criado_em: string;
  data_nascimento?: string;
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
  cor_texto_topo: string;
  ativa_banner: boolean;
  banner_url: string;
  banner_mobile_url: string;
  cor_banner: string;
  cor_fundo: string;
  cor_titulo: string;
  texto_botao: string;
  cor_botao: string;
  cor_texto_botao: string;
  rodape_texto: string;
  rodape_empresa: string;
  rodape_ano: string;
  mostrar_seguro: boolean;
  mensagem_rodape: string;
  url_termos_uso?: string;
  url_politica_privacidade?: string;
  mensagem_termos?: string;
  // New fields for visitor counter
  mostrar_contador?: boolean;
  texto_contador?: string;
  contador_min?: number;
  contador_max?: number;
  cor_texto_contador?: string; // New field for visitor counter message color
  // Form customization fields
  mostrar_campo_documento?: boolean;
  mostrar_campo_telefone?: boolean;
  mostrar_bandeira_brasil?: boolean; // New field for showing Brazil flag in phone input
  mostrar_prefixo_telefone?: boolean; // New field for showing +55 prefix in phone input
  titulo_identificacao?: string;
  titulo_pagamento?: string;
  // Icon properties
  cor_icones?: string;
  icone_nome?: string;
  icone_email?: string;
  icone_telefone?: string;
  icone_documento?: string;
  // Validation options
  validar_cpf?: boolean;
  validar_telefone?: boolean;
  validar_cartao?: boolean;
  mostrar_campo_nascimento?: boolean;
  validar_nascimento?: boolean;
};

export type Depoimento = {
  id: number;
  nome: string;
  texto: string;
  estrelas: number;
  foto_url: string;
  produto_id?: number;
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
