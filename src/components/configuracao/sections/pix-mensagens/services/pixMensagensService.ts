
import { PixMensagem } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fetchMessages = async (): Promise<PixMensagem[]> => {
  try {
    const { data, error } = await supabase
      .from("pix_mensagens")
      .select("*")
      .order("ordem");

    if (error) {
      console.error("Erro ao carregar mensagens PIX:", error);
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Erro ao buscar mensagens PIX:", error);
    toast.error("Erro ao carregar mensagens PIX: " + error.message);
    return [];
  }
};

const createMessage = async (
  mensagem: Omit<PixMensagem, "id" | "criado_em">
): Promise<PixMensagem | null> => {
  try {
    console.log("Creating new message:", mensagem);

    const { data, error } = await supabase
      .from("pix_mensagens")
      .insert(mensagem)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao criar mensagem PIX:", error);
    toast.error("Erro ao criar mensagem PIX: " + error.message);
    return null;
  }
};

const updateMessage = async (
  id: number,
  mensagem: Partial<PixMensagem>
): Promise<PixMensagem | null> => {
  try {
    console.log("Updating message:", mensagem);

    const { data, error } = await supabase
      .from("pix_mensagens")
      .update(mensagem)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Erro ao atualizar mensagem PIX:", error);
    toast.error("Erro ao atualizar mensagem PIX: " + error.message);
    return null;
  }
};

const deleteMessage = async (id: number): Promise<boolean> => {
  try {
    console.log("Deleting message id:", id);

    const { error } = await supabase
      .from("pix_mensagens")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Erro ao excluir mensagem PIX:", error);
    toast.error("Erro ao excluir mensagem PIX: " + error.message);
    return false;
  }
};

const updateMessageOrder = async (
  messageId: number,
  newOrder: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("pix_mensagens")
      .update({ ordem: newOrder })
      .eq("id", messageId);
      
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Erro ao atualizar ordem:", error);
    toast.error("Erro ao atualizar ordem: " + error.message);
    return false;
  }
};

export const pixMensagensService = {
  fetchMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  updateMessageOrder
};
