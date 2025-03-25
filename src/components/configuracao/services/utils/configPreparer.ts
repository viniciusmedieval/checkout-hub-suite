
import { ConfigCheckout } from "@/lib/types/database-types";
import { validateHex } from "./configValidation";
import { PaymentStatus } from "@/components/checkout/payment/types";

/**
 * Prepares config data for saving with all necessary validations
 */
export const prepareConfigForSave = (config: ConfigCheckout) => {
  console.log("🔄 Preparando configuração para salvar:", config);

  // Always ensure ID is not included when saving to avoid conflicts
  const { id, ...configWithoutId } = config;

  // Validate redirect_card_status
  let validStatus: PaymentStatus = "analyzing";
  const status = config.redirect_card_status || "analyzing";
  
  if (["analyzing", "approved", "rejected"].includes(status as string)) {
    validStatus = status as PaymentStatus;
  }

  // Create a clean object with all required fields and proper types
  const preparedConfig = {
    ...configWithoutId,
    mensagem_topo: config.mensagem_topo || "",
    cor_topo: validateHex(config.cor_topo || "") ? config.cor_topo : "#3b82f6",
    cor_texto_topo: validateHex(config.cor_texto_topo || "") ? config.cor_texto_topo : "#FFFFFF",
    ativa_banner: Boolean(config.ativa_banner),
    banner_url: config.banner_url || "",
    banner_mobile_url: config.banner_mobile_url || "",
    cor_banner: validateHex(config.cor_banner || "") ? config.cor_banner : "#3b82f6",
    cor_fundo: validateHex(config.cor_fundo || "") ? config.cor_fundo : "#FFFFFF",
    cor_titulo: validateHex(config.cor_titulo || "") ? config.cor_titulo : "#000000",
    texto_botao: config.texto_botao || "COMPRAR AGORA",
    cor_botao: validateHex(config.cor_botao || "") ? config.cor_botao : "#8B5CF6",
    cor_texto_botao: validateHex(config.cor_texto_botao || "") ? config.cor_texto_botao : "#FFFFFF",
    texto_botao_card: config.texto_botao_card || "FINALIZAR COMPRA",
    cor_botao_card: validateHex(config.cor_botao_card || "") ? config.cor_botao_card : "#8B5CF6",
    cor_texto_botao_card: validateHex(config.cor_texto_botao_card || "") ? config.cor_texto_botao_card : "#FFFFFF",
    rodape_texto: config.rodape_texto || "",
    rodape_empresa: config.rodape_empresa || "",
    rodape_ano: config.rodape_ano || new Date().getFullYear().toString(),
    mostrar_seguro: Boolean(config.mostrar_seguro),
    mensagem_rodape: config.mensagem_rodape || "",
    mensagem_termos: config.mensagem_termos || "",
    url_termos_uso: config.url_termos_uso || "",
    url_politica_privacidade: config.url_politica_privacidade || "",
    mostrar_campo_documento: Boolean(config.mostrar_campo_documento),
    mostrar_campo_telefone: Boolean(config.mostrar_campo_telefone),
    mostrar_bandeira_brasil: Boolean(config.mostrar_bandeira_brasil),
    mostrar_prefixo_telefone: Boolean(config.mostrar_prefixo_telefone),
    titulo_identificacao: config.titulo_identificacao || "Identificação",
    titulo_pagamento: config.titulo_pagamento || "Pagamento",
    mostrar_contador: Boolean(config.mostrar_contador),
    texto_contador: config.texto_contador || "{count} pessoas estão vendo este produto agora",
    contador_min: Number(config.contador_min) || 50,
    contador_max: Number(config.contador_max) || 20000,
    cor_texto_contador: validateHex(config.cor_texto_contador || "") ? config.cor_texto_contador : "#4B5563",
    cor_icones: validateHex(config.cor_icones || "") ? config.cor_icones : "#8a898c",
    icone_nome: config.icone_nome || "user",
    icone_email: config.icone_email || "mail",
    icone_telefone: config.icone_telefone || "smartphone",
    icone_documento: config.icone_documento || "file-text",
    validar_cpf: Boolean(config.validar_cpf),
    validar_telefone: Boolean(config.validar_telefone),
    validar_cartao: Boolean(config.validar_cartao),
    mostrar_campo_nascimento: Boolean(config.mostrar_campo_nascimento),
    validar_nascimento: Boolean(config.validar_nascimento),
    redirect_card_status: validStatus,
    modo_random: Boolean(config.modo_random),
    max_installments: Number(config.max_installments) || 12,
    // Ensure PIX fields are included
    pix_titulo: config.pix_titulo || "Pagamento via PIX",
    pix_subtitulo: config.pix_subtitulo || "Pague instantaneamente",
    pix_instrucoes: config.pix_instrucoes || "Escaneie o código QR com seu aplicativo bancário",
    pix_mensagem_seguranca: config.pix_mensagem_seguranca || "Pagamento 100% seguro e processado instantaneamente",
    cor_primaria_pix: validateHex(config.cor_primaria_pix || "") ? config.cor_primaria_pix : "#33CC95",
    cor_secundaria_pix: validateHex(config.cor_secundaria_pix || "") ? config.cor_secundaria_pix : "#E5F7EF",
    cor_botao_pix: validateHex(config.cor_botao_pix || "") ? config.cor_botao_pix : "#33CC95",
    cor_texto_botao_pix: validateHex(config.cor_texto_botao_pix || "") ? config.cor_texto_botao_pix : "#FFFFFF",
    tipo_chave_pix_global: config.tipo_chave_pix_global || "",
    chave_pix_global: config.chave_pix_global || "",
    nome_beneficiario_pix: config.nome_beneficiario_pix || "",
    qr_code_pix_url: config.qr_code_pix_url || "",
    usar_api_pix_global: Boolean(config.usar_api_pix_global),
    url_api_pix_global: config.url_api_pix_global || ""
  };

  console.log("✅ Configuração preparada para salvar:", preparedConfig);
  return preparedConfig;
};
