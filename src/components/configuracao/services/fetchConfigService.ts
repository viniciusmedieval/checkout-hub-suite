
import { supabase, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { ensureBooleanFields, handleConfigError } from "./utils/configValidation";

/**
 * Fetches the most recent checkout configuration
 */
export const fetchCheckoutConfig = async (): Promise<ConfigCheckout | null> => {
  try {
    console.log("Iniciando fetchCheckoutConfig");
    
    // Get the most recent configuration
    const { data, error } = await supabase
      .from("config_checkout")
      .select("*")
      .order('criado_em', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Erro ao carregar configurações do checkout:", error);
      toast.error("Erro ao carregar configurações do checkout");
      return null;
    }
    
    // Check if we have data and use the first item
    if (data && data.length > 0) {
      // Ensure boolean fields are properly typed and log the data
      const configData = ensureBooleanFields(data[0]);
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
