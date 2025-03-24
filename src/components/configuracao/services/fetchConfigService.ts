
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { ensureBooleanFields, handleConfigError } from "./utils/configValidation";

/**
 * Fetches the most recent checkout configuration
 */
export const fetchCheckoutConfig = async (): Promise<ConfigCheckout | null> => {
  try {
    console.log("Iniciando fetchCheckoutConfig");
    const result = await supabase
      .from("config_checkout")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (result.error) {
      console.error("Erro ao carregar configurações do checkout:", result.error);
      toast.error("Erro ao carregar configurações do checkout");
      return null;
    }
    
    if (result.data) {
      // Ensure boolean fields are properly typed and log the data
      const configData = ensureBooleanFields(result.data);
      console.log("Configurações carregadas com sucesso:", configData);
      return configData;
    }
    
    console.log("Nenhuma configuração encontrada no banco de dados");
    return null;
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    toast.error("Erro ao carregar configurações. Tente novamente mais tarde.");
    return null;
  }
};
