
import { supabase } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";
import { createNewConfig } from "./createConfig";

/**
 * Updates an existing configuration in the database
 */
export async function updateExistingConfig(config: ConfigCheckout, configToSave: any): Promise<ConfigCheckout | null> {
  console.log(`🔄 Atualizando configuração existente com ID ${config.id}`, configToSave);

  try {
    // Guarantee we have a valid Supabase client
    if (!supabase) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Extra debug for test values
    const isTestConfig = (
      configToSave.cor_fundo === "#FF0000" && 
      configToSave.cor_texto === "#FFFFFF" && 
      configToSave.texto_botao === "Finalizar Compra"
    );
    
    if (isTestConfig) {
      console.log("🧪 TESTE AUTOMÁTICO: Detectado valores de teste na função updateExistingConfig");
      console.log("🧪 Valores de teste:", { 
        cor_fundo: configToSave.cor_fundo,
        cor_texto: configToSave.cor_texto,
        texto_botao: configToSave.texto_botao
      });
    }

    // Validate connection to Supabase
    try {
      const { count, error: countError } = await supabase
        .from('config_checkout')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw new Error(`Falha na verificação da conexão: ${countError.message}`);
      }
      console.log(`✅ Conexão com Supabase verificada. Tabela tem ${count} registros.`);
    } catch (connError: any) {
      console.error("❌ Erro na verificação da conexão com Supabase:", connError);
      toast.error(`Erro de conexão: ${connError.message}`);
      throw connError;
    }

    // Verificar se o registro existe antes de atualizar
    const { data: existingConfig, error: fetchError } = await supabase
      .from("config_checkout")
      .select("id")
      .eq("id", config.id)
      .single();

    if (fetchError) {
      console.error("❌ Configuração com ID não encontrada ou erro ao buscar:", fetchError);
      
      if (fetchError.code === 'PGRST116') {
        // Erro de registro não encontrado, tentar criar nova configuração
        console.log("🔄 Configuração não encontrada, criando nova...");
        return await createNewConfig(configToSave);
      }
      
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
      .maybeSingle();

    if (selectError) {
      console.error("❌ Erro ao buscar configuração atualizada:", selectError);
      toast.error("Configuração atualizada, mas houve erro ao buscar os dados atualizados.");
      return config; // Retornar a config original como feedback
    }

    if (!data) {
      console.error("❌ Erro: Retorno nulo do Supabase após atualização");
      toast.error("Erro ao recuperar dados atualizados. Tente novamente.");
      return config; // Retornar a config original como feedback
    }

    const processedData = ensureBooleanFields(data);
    
    if (isTestConfig) {
      console.log("✅ TESTE AUTOMÁTICO: Configuração atualizada com sucesso:", processedData);
      console.log("✅ VERIFICAÇÃO DE VALORES:");
      console.log(`  cor_fundo: ${processedData.cor_fundo} (esperado: #FF0000) ${processedData.cor_fundo === "#FF0000" ? "✓" : "✗"}`);
      console.log(`  cor_texto: ${processedData.cor_texto} (esperado: #FFFFFF) ${processedData.cor_texto === "#FFFFFF" ? "✓" : "✗"}`);
      console.log(`  texto_botao: ${processedData.texto_botao} (esperado: Finalizar Compra) ${processedData.texto_botao === "Finalizar Compra" ? "✓" : "✗"}`);
    } else {
      console.log("✅ Configuração atualizada com sucesso:", processedData);
    }
    
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("❌ Erro ao atualizar configuração:", error);
    toast.error("Erro ao atualizar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
