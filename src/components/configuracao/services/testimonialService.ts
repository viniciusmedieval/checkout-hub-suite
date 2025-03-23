
import { supabase, Depoimento } from "@/lib/supabase";
import { toast } from "sonner";
import { getDefaultTestimonials } from "@/components/checkout/testimonials/DefaultTestimonials";

/**
 * Fetches all testimonials from the database
 * If no testimonials are found, creates and returns default ones
 */
export const fetchTestimonials = async (): Promise<Depoimento[]> => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*")
      .order('criado_em', { ascending: false });
      
    if (error) {
      console.error("Erro ao carregar depoimentos:", error);
      toast.error("Erro ao carregar depoimentos");
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhum depoimento encontrado, adicionando depoimentos padrão");
      const defaultTestimonials = getDefaultTestimonials();
      
      const depoimentosParaInserir = defaultTestimonials.map(dep => ({
        nome: dep.nome,
        texto: dep.texto,
        estrelas: dep.estrelas,
        foto_url: dep.foto_url,
        produto_id: 0,
        criado_em: new Date().toISOString()
      }));
      
      const { data: insertedData, error: insertError } = await supabase
        .from("depoimentos")
        .insert(depoimentosParaInserir)
        .select();
        
      if (insertError) {
        console.error("Erro ao inserir depoimentos padrão:", insertError);
        return [];
      }
      
      console.log("Depoimentos padrão adicionados com sucesso:", insertedData);
      return insertedData || [];
    }
    
    console.log("Depoimentos carregados do banco:", data);
    return data || [];
  } catch (error) {
    console.error("Erro ao carregar depoimentos:", error);
    toast.error("Erro ao carregar depoimentos. Tente novamente mais tarde.");
    return [];
  }
};

/**
 * Deletes a testimonial from the database
 */
export const deleteTestimonial = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("depoimentos")
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("Depoimento excluído com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    toast.error("Erro ao excluir depoimento. Tente novamente.");
    return false;
  }
};

/**
 * Adds a new testimonial to the database
 */
export const addTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">): Promise<Depoimento | null> => {
  try {
    const { data, error } = await supabase
      .from("depoimentos")
      .insert([depoimento])
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      toast.success("Depoimento adicionado com sucesso!");
      return data[0] as Depoimento;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao adicionar depoimento:", error);
    toast.error("Erro ao adicionar depoimento. Tente novamente.");
    return null;
  }
};

/**
 * Updates an existing testimonial in the database
 */
export const updateTestimonial = async (id: number, depoimento: Partial<Depoimento>): Promise<Depoimento | null> => {
  try {
    const { error } = await supabase
      .from("depoimentos")
      .update(depoimento)
      .eq('id', id);
      
    if (error) throw error;
    
    const { data, error: fetchError } = await supabase
      .from("depoimentos")
      .select("*")
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    toast.success("Depoimento atualizado com sucesso!");
    return data as Depoimento;
  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error);
    toast.error("Erro ao atualizar depoimento. Tente novamente.");
    return null;
  }
};
