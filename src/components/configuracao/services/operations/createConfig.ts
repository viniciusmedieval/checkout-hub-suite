
import { supabase, getSupabaseClient } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";

/**
 * Creates a new configuration in the database
 */
export async function createNewConfig(configToSave: any): Promise<ConfigCheckout | null> {
  console.log("🔄 Criando nova configuração", configToSave);

  try {
    // Get client from the singleton
    const client = await getSupabaseClient();
    
    // Guarantee we have a valid Supabase client
    if (!client) {
      throw new Error("Cliente Supabase não disponível");
    }

    // Extra debug for test values
    const isTestConfig = (
      configToSave.cor_fundo === "#FF0000" && 
      configToSave.cor_texto === "#FFFFFF" && 
      configToSave.texto_botao === "Finalizar Compra"
    );
    
    if (isTestConfig) {
      console.log("🧪 TESTE AUTOMÁTICO: Detectado valores de teste na função createNewConfig");
      console.log("🧪 Valores de teste:", { 
        cor_fundo: configToSave.cor_fundo,
        cor_texto: configToSave.cor_texto,
        texto_botao: configToSave.texto_botao
      });
    }

    // Validate connection to Supabase
    try {
      // Use a simpler query instead of count(*) to avoid parsing issues
      const { data, error: queryError } = await client
        .from('config_checkout')
        .select('id')
        .limit(1);
      
      if (queryError) {
        throw new Error(`Falha na verificação da conexão: ${queryError.message}`);
      }
      console.log(`✅ Conexão com Supabase verificada. Verificação de consulta simples concluída.`);
    } catch (connError: any) {
      console.error("❌ Erro na verificação da conexão com Supabase:", connError);
      toast.error(`Erro de conexão: ${connError.message}`);
      throw connError;
    }

    // Inserir nova configuração
    const { data: insertedData, error: insertError } = await client
      .from("config_checkout")
      .insert([configToSave])
      .select(); // Aqui podemos usar .select() porque o Supabase retorna os dados inseridos

    if (insertError) {
      console.error("❌ Erro ao criar configurações:", insertError);
      toast.error("Erro ao criar configurações: " + insertError.message);
      return null;
    }

    if (!insertedData || insertedData.length === 0) {
      console.error("❌ Erro: Retorno nulo do Supabase após inserção");
      toast.error("Erro ao recuperar dados criados. Tente novamente.");
      return null;
    }

    const processedData = ensureBooleanFields(insertedData[0]);
    
    if (isTestConfig) {
      console.log("✅ TESTE AUTOMÁTICO: Configuração criada com sucesso:", processedData);
      console.log("✅ VERIFICAÇÃO DE VALORES:");
      console.log(`  cor_fundo: ${processedData.cor_fundo} (esperado: #FF0000) ${processedData.cor_fundo === "#FF0000" ? "✓" : "✗"}`);
      console.log(`  cor_texto: ${processedData.cor_texto} (esperado: #FFFFFF) ${processedData.cor_texto === "#FFFFFF" ? "✓" : "✗"}`);
      console.log(`  texto_botao: ${processedData.texto_botao} (esperado: Finalizar Compra) ${processedData.texto_botao === "Finalizar Compra" ? "✓" : "✗"}`);
    } else {
      console.log("✅ Configuração criada com sucesso:", processedData);
    }
    
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("❌ Erro ao criar nova configuração:", error);
    toast.error("Erro ao criar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
