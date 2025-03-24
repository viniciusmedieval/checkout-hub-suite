
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { ensureBooleanFields, handleConfigError } from "./utils/configValidation";

/**
 * Fetches the most recent checkout configuration
 */
export const fetchCheckoutConfig = async (): Promise<ConfigCheckout | null> => {
  try {
    console.log("Iniciando fetchCheckoutConfig");
    const { data, error } = await supabase
      .from("config_checkout")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Erro ao carregar configurações do checkout:", error);
      toast.error("Erro ao carregar configurações do checkout");
      return null;
    }
    
    if (data && data.length > 0) {
      // Ensure boolean fields are properly typed using the utility function
      const configData = ensureBooleanFields(data[0]);
      console.log("Configurações carregadas:", configData);
      return configData;
    }
    
    console.log("Nenhuma configuração encontrada no banco de dados");
    return null;
  } catch (error) {
    return handleConfigError(error, "carregar");
  }
};
