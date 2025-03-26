
import { supabase } from "@/lib/supabase";
import { ConfigCheckout } from "@/lib/types/database-types";

/**
 * Fetches the latest checkout configuration from Supabase
 */
export const fetchCheckoutConfig = async (): Promise<ConfigCheckout | null> => {
  try {
    console.log("🔄 Buscando configurações do checkout...");
    
    const { data, error } = await supabase
      .from("config_checkout")
      .select("*")
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error("❌ Erro ao buscar configurações:", error);
      return null;
    }
    
    if (!data) {
      console.log("ℹ️ Nenhuma configuração encontrada.");
      return null;
    }
    
    // Convert string boolean values to actual booleans
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && (data[key] === 'true' || data[key] === 'false')) {
        data[key] = data[key] === 'true';
      }
    });
    
    console.log("✅ Configuração carregada:", data);
    return data as ConfigCheckout;
  } catch (error) {
    console.error("❌ Erro ao buscar configurações:", error);
    return null;
  }
};
