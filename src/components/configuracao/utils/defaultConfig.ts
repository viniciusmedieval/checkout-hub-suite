
import { ConfigCheckout } from "@/lib/supabase";

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
  validar_nascimento: false
};
