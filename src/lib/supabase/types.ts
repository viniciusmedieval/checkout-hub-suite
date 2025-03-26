
// Re-export all types from the database-types file
export * from '../types/database-types';

// Legacy type definitions (kept for backward compatibility)
export interface ConfigCheckout {
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
  texto_botao_card?: string | null;
  cor_botao_card?: string | null;
  cor_texto_botao_card?: string | null;
  texto_botao_pix?: string | null;
  cor_botao_pix?: string | null;
  cor_texto_botao_pix?: string | null;
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
  tipo_chave_pix_global?: string | null;
  chave_pix_global?: string | null;
  nome_beneficiario_pix?: string | null;
  qr_code_pix_url?: string | null;
  usar_api_pix_global?: boolean | null;
  url_api_pix_global?: string | null;
  mostrar_depoimentos?: boolean | null;
  slug?: string | null;
  pix_secao_id?: number | null;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  slug: string;
  valor: number;
  tipo: string;
  checkout_title?: string;
  checkout_button_text?: string;
  imagem_url?: string;
  banner_url?: string;
  banner_mobile_url?: string;
  background_color?: string;
  banner_color?: string;
  ativo?: boolean;
  criado_em?: string;
  
  // PIX-related fields
  tipo_chave_pix?: string;
  chave_pix?: string;
  nome_beneficiario?: string;
  usar_api_pix?: boolean;
  url_api_pix?: string;
  url_pix_api?: string;
  usar_config_pix_global?: boolean;
  qr_code_pix_url?: string;
}
