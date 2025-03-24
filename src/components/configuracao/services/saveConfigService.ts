// src/components/configuracao/services/saveConfigService.ts
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { validateHex, ensureBooleanFields } from "./utils/configValidation";

/**
 * Prepares config data for saving with all necessary validations
 */
const prepareConfigForSave = (config: ConfigCheckout) => {
  console.log("🔄 Preparando configuração para salvar:", config);

  // Always ensure ID is not included when saving to avoid conflicts
  const { id, ...configWithoutId } = config;

  // Create a clean object with all required fields and proper types
  const preparedConfig = {
    ...configWithoutId,
    mensagem_topo: config.mensagem_topo || "",
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
    contador_min: Number(config.contador_min) || 50,
    contador_max: Number(config.contador_max) || 20000,
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
    validar_nascimento: Boolean(config.validar_nascimento),
  };

  console.log("✅ Configuração preparada para salvar:", preparedConfig);
  return preparedConfig;
};

/**
 * Saves checkout configuration to the database
 */
export const saveConfig = async (config: ConfigCheckout): Promise<ConfigCheckout | null> => {
  try {
    console.log("🔄 Iniciando saveConfig com dados:", config);

    // Verificar se o cliente Supabase está inicializado corretamente
    if (!supabase) {
      console.error("❌ Cliente Supabase não inicializado. Verifique as credenciais.");
      toast.error("Erro: Cliente Supabase não inicializado. Verifique as credenciais.");
      return null;
    }

    const configToSave = prepareConfigForSave(config);

    // Validar dados antes de salvar
    if (!configToSave.texto_botao || !configToSave.cor_botao) {
      console.error("❌ Dados inválidos para salvar:", configToSave);
      toast.error("Erro: Dados inválidos para salvar. Verifique os campos obrigatórios.");
      return null;
    }

    if (config.id) {
      console.log(`🔄 Atualizando configuração existente com ID ${config.id}`);

      // Verificar se o registro existe antes de atualizar
      const { data: existingConfig, error: fetchError } = await supabase
        .from("config_checkout")
        .select("id")
        .eq("id", config.id)
        .single();

      if (fetchError || !existingConfig) {
        console.error("❌ Configuração com ID não encontrada ou erro ao buscar:", fetchError);
        toast.error("Erro: Configuração não encontrada para atualização.");
        return null;
      }

      // Atualizar a configuração
      const { error } = await supabase
        .from("config_checkout")
        .update(configToSave)
        .eq("id", config.id);

      if (error) {
        console.error("❌ Erro ao atualizar configurações:", error);
        toast.error("Erro ao atualizar configurações: " + error.message);
        return null;
      }

      // Buscar os dados atualizados
      console.log("🔄 Buscando configuração atualizada em consulta separada");
      const { data, error: selectError } = await supabase
        .from("config_checkout")
        .select("*")
        .eq("id", config.id)
        .single();

      if (selectError) {
        console.error("❌ Erro ao buscar configuração atualizada:", selectError);
        toast.error("Configuração atualizada, mas houve erro ao buscar os dados atualizados.");
        return null;
      }

      if (!data) {
        console.error("❌ Erro: Retorno nulo do Supabase após atualização");
        toast.error("Erro ao recuperar dados atualizados. Tente novamente.");
        return null;
      }

      const processedData = ensureBooleanFields(data);
      console.log("✅ Configuração atualizada com sucesso:", processedData);
      toast.success("Configurações salvas com sucesso!");
      return processedData;
    } else {
      console.log("🔄 Criando nova configuração");

      // Inserir nova configuração
      const { data: insertedData, error: insertError } = await supabase
        .from("config_checkout")
        .insert([configToSave])
        .select() // Aqui podemos usar .select() porque o Supabase retorna os dados inseridos
        .single();

      if (insertError) {
        console.error("❌ Erro ao criar configurações:", insertError);
        toast.error("Erro ao criar configurações: " + insertError.message);
        return null;
      }

      if (!insertedData) {
        console.error("❌ Erro: Retorno nulo do Supabase após inserção");
        toast.error("Erro ao recuperar dados criados. Tente novamente.");
        return null;
      }

      const processedData = ensureBooleanFields(insertedData);
      console.log("✅ Configuração criada com sucesso:", processedData);
      toast.success("Configurações salvas com sucesso!");
      return processedData;
    }
  } catch (error) {
    console.error("❌ Erro no saveConfig:", error);
    toast.error("Erro ao salvar configurações: " + (error.message || "Erro desconhecido"));
    return null;
  }
};
