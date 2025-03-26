
import { ConfigCheckout } from "@/lib/types/database-types";

export const defaultConfig: ConfigCheckout = {
  id: 0,
  mensagem_topo: "Oferta especial por tempo limitado! Aproveite agora.",
  cor_topo: "#3b82f6",
  cor_texto_topo: "#FFFFFF",
  ativa_banner: true,
  banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Desktop",
  banner_mobile_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Banner+Mobile",
  cor_banner: "#3b82f6",
  cor_fundo: "#FFFFFF",
  cor_titulo: "#000000",
  texto_botao: "GARANTIR AGORA",
  cor_botao: "#8B5CF6", 
  cor_texto_botao: "#FFFFFF",
  texto_botao_card: "Pagar com Cartão",
  cor_botao_card: "#8B5CF6",
  cor_texto_botao_card: "#FFFFFF",
  texto_botao_pix: "PAGAR COM PIX",
  cor_botao_pix: "#8B5CF6", 
  cor_texto_botao_pix: "#FFFFFF",
  rodape_texto: "Todos os direitos reservados.",
  rodape_empresa: "Minha Empresa LTDA",
  rodape_ano: "2023",
  mostrar_seguro: true,
  mensagem_rodape: "Compra 100% segura e garantida.",
  mensagem_termos: "Ao clicar em \"Comprar\", você concorda com os Termos de Compra e está ciente da Política de Privacidade.",
  // Form fields
  mostrar_campo_documento: true,
  mostrar_campo_telefone: true,
  mostrar_bandeira_brasil: true,
  mostrar_prefixo_telefone: true,
  mostrar_campo_nascimento: false,
  titulo_identificacao: "Identificação",
  titulo_pagamento: "Pagamento",
  // Visitor counter
  mostrar_contador: true,
  texto_contador: "{count} pessoas estão vendo este produto agora",
  contador_min: 50,
  contador_max: 20000,
  cor_texto_contador: "#4B5563",
  // Icon properties
  cor_icones: "#8a898c",
  icone_nome: "user",
  icone_email: "mail",
  icone_telefone: "smartphone",
  icone_documento: "file-text",
  // Validation fields
  validar_cpf: false,
  validar_telefone: false,
  validar_cartao: false,
  validar_nascimento: false,
  // Redirect settings
  redirect_card_status: "analyzing",
  // Random mode
  modo_random: false,
  // Installments default
  max_installments: 12,
  // PIX defaults
  pix_titulo: "Pagamento via Pix",
  pix_subtitulo: "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
  pix_instrucoes: "Para realizar o pagamento:",
  pix_mensagem_seguranca: "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
  cor_primaria_pix: "#1E40AF",
  cor_secundaria_pix: "#DBEAFE",
  tipo_chave_pix_global: "email",
  usar_api_pix_global: false,
  pix_secao_id: null
};
