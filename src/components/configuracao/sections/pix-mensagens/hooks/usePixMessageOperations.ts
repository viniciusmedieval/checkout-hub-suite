
import { PixMensagem } from "@/lib/types/database-types";
import { pixMensagensService } from "../services/pixMensagensService";
import { Dispatch, SetStateAction } from "react";

export const usePixMessageOperations = (
  setIsSaving: Dispatch<SetStateAction<boolean>>
) => {
  const fetchMessages = async (): Promise<PixMensagem[]> => {
    try {
      return await pixMensagensService.fetchMessages();
    } catch (error) {
      console.error("Error in fetchMessages operation:", error);
      return [];
    }
  };

  const createMessage = async (
    message: Omit<PixMensagem, "id" | "criado_em">
  ): Promise<PixMensagem | null> => {
    try {
      return await pixMensagensService.createMessage(message);
    } catch (error) {
      console.error("Error in createMessage operation:", error);
      return null;
    }
  };

  const updateMessage = async (
    id: number, 
    message: Partial<PixMensagem>
  ): Promise<PixMensagem | null> => {
    try {
      return await pixMensagensService.updateMessage(id, message);
    } catch (error) {
      console.error("Error in updateMessage operation:", error);
      return null;
    }
  };

  const deleteMessage = async (id: number): Promise<boolean> => {
    try {
      return await pixMensagensService.deleteMessage(id);
    } catch (error) {
      console.error("Error in deleteMessage operation:", error);
      return false;
    }
  };

  const updateMessageOrder = async (
    messageId: number,
    newOrder: number
  ): Promise<boolean> => {
    try {
      return await pixMensagensService.updateMessageOrder(messageId, newOrder);
    } catch (error) {
      console.error("Error in updateMessageOrder operation:", error);
      return false;
    }
  };

  return {
    fetchMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    updateMessageOrder
  };
};
