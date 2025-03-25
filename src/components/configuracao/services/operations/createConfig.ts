
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { ensureBooleanFields } from "../utils/configValidation";

/**
 * Creates a new configuration in the database
 */
export async function createNewConfig(configToSave: any): Promise<ConfigCheckout | null> {
  console.log("🔄 Criando nova configuração");

  try {
    // Inserir nova configuração
    const { data: insertedData, error: insertError } = await supabase
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
    console.log("✅ Configuração criada com sucesso:", processedData);
    toast.success("Configurações salvas com sucesso!");
    return processedData;
  } catch (error: any) {
    console.error("❌ Erro ao criar nova configuração:", error);
    toast.error("Erro ao criar configuração: " + (error.message || "Erro desconhecido"));
    return null;
  }
}
