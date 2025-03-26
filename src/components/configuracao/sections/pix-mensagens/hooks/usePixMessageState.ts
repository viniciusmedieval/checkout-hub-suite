
import { useState } from "react";
import { PixMensagem } from "@/lib/types/database-types";

export const usePixMessageState = () => {
  const [messages, setMessages] = useState<PixMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<PixMensagem | null>(null);
  const [newMessage, setNewMessage] = useState<Partial<PixMensagem>>({
    chave: "",
    titulo: "",
    texto: "",
    ativo: true,
    ordem: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    editingMessage,
    setEditingMessage,
    newMessage,
    setNewMessage,
    isSaving,
    setIsSaving
  };
};
