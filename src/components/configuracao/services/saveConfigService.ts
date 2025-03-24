
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { validateHex, ensureBooleanFields } from "./utils/configValidation";

/**
 * Prepares config data for saving with all necessary validations
 */
const prepareConfigForSave = (config: ConfigCheckout) => {
  console.log("Preparando configuração para salvar:", config);
  
  // Always ensure ID is not included in the data when saving to Supabase
  // This avoids conflicts between string and number IDs
  const { id, ...configWithoutId } = config;
  
  return {
    ...configWithoutId,
    mensagem_topo: config.mensagem_topo,
    cor_topo: validateHex(config.cor_topo) ? config.cor_topo : "#3b82f6",
    cor_texto_topo: validateHex(config.cor_texto_topo) ? config.cor_texto_topo : "#FFFFFF",
    ativa_banner: Boolean(config.ativa_banner),
    banner_url: config.banner_url || "",
    banner_mobile_url: config.banner_mobile_url || "",
    cor_banner: validateHex(config.cor_banner) ? config.cor_banner : "#3b82f6",
    cor_fundo: validateHex(config.cor_fundo) ? config.cor_fundo : "#FFFFFF",
    cor_titulo: validateHex(config.cor_titulo) ? config.cor_titulo : "#000000",
    texto_botao: config.texto_botao || "COMPRAR AGORA",
    cor_botao: validateHex(config.cor_botao) ? config.cor_botao : "#8B5CF6",
    cor_texto_botao: validateHex(config.cor_texto_botao) ? config.cor_texto_botao : "#FFFFFF",
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
    contador_min: config.contador_min || 50,
    contador_max: config.contador_max || 20000,
    cor_texto_contador: validateHex(config.cor_texto_contador) ? config.cor_texto_contador : "#4B5563",
    cor_icones: validateHex(config.cor_icones) ? config.cor_icones : "#8a898c",
    icone_nome: config.icone_nome || "user",
    icone_email: config.icone_email || "mail",
    icone_telefone: config.icone_telefone || "smartphone",
    icone_documento: config.icone_documento || "file-text",
    validar_cpf: Boolean(config.validar_cpf),
    validar_telefone: Boolean(config.validar_telefone),
    validar_cartao: Boolean(config.validar_cartao),
    mostrar_campo_nascimento: Boolean(config.mostrar_campo_nascimento),
    validar_nascimento: Boolean(config.validar_nascimento)
  };
};

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    console.log("Iniciando saveConfig com dados:", config);
    
    const configToSave = prepareConfigForSave(config);
    console.log("Configurações validadas a serem salvas:", configToSave);
    
    let result;
    
    if (config.id) {
      console.log(`Atualizando configuração existente com ID ${config.id}`);
      
      result = await supabase
        .from("config_checkout")
        .update(configToSave)
        .eq('id', config.id)
        .select('*')
        .single();
        
    } else {
      console.log("Criando nova configuração");
      
      result = await supabase
        .from("config_checkout")
        .insert([configToSave])
        .select('*')
        .single();
    }
    
    if (result.error) {
      console.error("Erro ao salvar configurações:", result.error);
      toast.error("Erro ao salvar configurações: " + result.error.message);
      return null;
    }
    
    console.log("Configuração salva com sucesso, resposta:", result.data);
    
    if (result.data) {
      // Process and return the data from the response
      const processedData = ensureBooleanFields(result.data);
      console.log("Dados processados a serem retornados:", processedData);
      toast.success("Configurações salvas com sucesso!");
      return processedData;
    }
    
    console.error("Nenhum dado retornado após salvar");
    toast.error("Erro ao salvar: nenhum dado retornado");
    return null;
  } catch (error) {
    console.error("Erro no saveConfig:", error);
    toast.error("Erro ao salvar configurações. Tente novamente.");
    return null;
  }
};
