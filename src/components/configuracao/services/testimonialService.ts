
import { supabase } from "@/lib/supabase";
import { Depoimento } from "@/lib/types/database-types";
import { toast } from "sonner";
import { defaultTestimonials } from "@/components/checkout/testimonials/DefaultTestimonials";

/**
 * Fetches all testimonials from the database
 * If no testimonials are found, returns default ones
 */
export const fetchTestimonials = async (produtoId?: number): Promise<Depoimento[]> => {
  try {
    console.log("🔍 Buscando depoimentos...", produtoId ? `para o produto ID: ${produtoId}` : "gerais");
    
    let query = supabase
      .from("depoimentos")
      .select("*")
      .order('id', { ascending: false });
    
    // If we have a product ID, filter testimonials by that product ID
    if (produtoId) {
      query = query.eq('produto_id', produtoId);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error("❌ Erro ao carregar depoimentos:", error);
      toast.error("Erro ao carregar depoimentos");
      return defaultTestimonials;
    }
    
    if (!data || data.length === 0) {
      console.log("ℹ️ Nenhum depoimento encontrado, retornando depoimentos padrão");
      return defaultTestimonials;
    }
    
    console.log("✅ Depoimentos carregados com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao carregar depoimentos:", error);
    toast.error("Erro ao carregar depoimentos. Tente novamente mais tarde.");
    return defaultTestimonials;
  }
};

/**
 * Deletes a testimonial from the database
 */
export const deleteTestimonial = async (id: number): Promise<boolean> => {
  try {
    console.log("🗑️ Excluindo depoimento ID:", id);
    
    const { error } = await supabase
      .from("depoimentos")
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log("✅ Depoimento excluído com sucesso!");
    toast.success("Depoimento excluído com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao excluir depoimento:", error);
    toast.error("Erro ao excluir depoimento. Tente novamente.");
    return false;
  }
};

/**
 * Adds a new testimonial to the database
 */
export const addTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">): Promise<Depoimento | null> => {
  try {
    console.log("➕ Adicionando novo depoimento:", depoimento);
    
    const { data, error } = await supabase
      .from("depoimentos")
      .insert([depoimento])
      .select();
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.error("❌ Erro: Retorno nulo do Supabase após inserção de depoimento");
      toast.error("Erro ao adicionar depoimento. Tente novamente.");
      return null;
    }
    
    console.log("✅ Depoimento adicionado com sucesso:", data[0]);
    toast.success("Depoimento adicionado com sucesso!");
    return data[0] as Depoimento;
  } catch (error) {
    console.error("❌ Erro ao adicionar depoimento:", error);
    toast.error("Erro ao adicionar depoimento. Tente novamente.");
    return null;
  }
};

/**
 * Updates an existing testimonial in the database
 */
export const updateTestimonial = async (id: number, depoimento: Partial<Depoimento>): Promise<Depoimento | null> => {
  try {
    console.log("🔄 Atualizando depoimento ID:", id, depoimento);
    
    const { data, error } = await supabase
      .from("depoimentos")
      .update(depoimento)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.error("❌ Erro: Retorno nulo do Supabase após atualização de depoimento");
      toast.error("Erro ao atualizar depoimento. Tente novamente.");
      return null;
    }
    
    console.log("✅ Depoimento atualizado com sucesso:", data[0]);
    toast.success("Depoimento atualizado com sucesso!");
    return data[0] as Depoimento;
  } catch (error) {
    console.error("❌ Erro ao atualizar depoimento:", error);
    toast.error("Erro ao atualizar depoimento. Tente novamente.");
    return null;
  }
};
