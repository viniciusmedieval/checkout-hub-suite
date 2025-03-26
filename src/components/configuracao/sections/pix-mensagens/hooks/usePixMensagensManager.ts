
import { useState, useEffect } from "react";
import { PixMensagem } from "@/lib/types/database-types";
import { toast } from "sonner";
import { usePixMessageOperations } from "./usePixMessageOperations";
import { usePixMessageState } from "./usePixMessageState";

export const usePixMensagensManager = () => {
  const {
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
  } = usePixMessageState();

  const {
    createMessage,
    updateMessage,
    deleteMessage,
    updateMessageOrder,
    fetchMessages
  } = usePixMessageOperations(setIsSaving);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erro ao carregar mensagens PIX");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleCreateMessage = async () => {
    try {
      if (!newMessage.chave || !newMessage.titulo || !newMessage.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);
      
      if (!newMessage.ordem) {
        newMessage.ordem = messages.length > 0 
          ? Math.max(...messages.map(msg => msg.ordem || 0)) + 1 
          : 1;
      }

      const createdMessage = await createMessage({
        chave: newMessage.chave!,
        titulo: newMessage.titulo!,
        texto: newMessage.texto!,
        ativo: newMessage.ativo ?? true,
        ordem: newMessage.ordem
      });

      if (createdMessage) {
        setMessages([...messages, createdMessage]);
        setNewMessage({
          chave: "",
          titulo: "",
          texto: "",
          ativo: true,
          ordem: 0
        });
        toast.success("Mensagem PIX criada com sucesso");
      }
    } catch (error) {
      console.error("Error creating message:", error);
      toast.error("Erro ao criar mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMessage = async () => {
    try {
      if (!editingMessage || !editingMessage.id) {
        toast.error("Nenhuma mensagem selecionada para edição");
        return;
      }

      if (!editingMessage.chave || !editingMessage.titulo || !editingMessage.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);
      
      const updatedMessage = await updateMessage(editingMessage.id, {
        chave: editingMessage.chave,
        titulo: editingMessage.titulo,
        texto: editingMessage.texto,
        ativo: editingMessage.ativo,
        ordem: editingMessage.ordem
      });

      if (updatedMessage) {
        setMessages(messages.map(msg => 
          msg.id === editingMessage.id ? updatedMessage : msg
        ));
        setEditingMessage(null);
        toast.success("Mensagem PIX atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Erro ao atualizar mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
        return;
      }

      setIsSaving(true);
      
      const success = await deleteMessage(id);

      if (success) {
        setMessages(messages.filter(msg => msg.id !== id));
        toast.success("Mensagem PIX excluída com sucesso");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Erro ao excluir mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUp = async (message: PixMensagem) => {
    try {
      const index = messages.findIndex(msg => msg.id === message.id);
      if (index <= 0) return; // Already at the top
      
      setIsSaving(true);
      
      const previousMessage = messages[index - 1];
      
      const updates = [
        { id: message.id, ordem: previousMessage.ordem },
        { id: previousMessage.id, ordem: message.ordem }
      ];
      
      let success = true;
      for (const update of updates) {
        const updated = await updateMessageOrder(update.id, update.ordem);
        if (!updated) {
          success = false;
          break;
        }
      }
      
      if (success) {
        const newMessages = [...messages];
        newMessages[index] = { ...newMessages[index], ordem: previousMessage.ordem };
        newMessages[index - 1] = { ...newMessages[index - 1], ordem: message.ordem };
        
        newMessages.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        setMessages(newMessages);
        
        toast.success("Ordem atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error moving message up:", error);
      toast.error("Erro ao atualizar ordem da mensagem");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMoveDown = async (message: PixMensagem) => {
    try {
      const index = messages.findIndex(msg => msg.id === message.id);
      if (index >= messages.length - 1) return; // Already at the bottom
      
      setIsSaving(true);
      
      const nextMessage = messages[index + 1];
      
      const updates = [
        { id: message.id, ordem: nextMessage.ordem },
        { id: nextMessage.id, ordem: message.ordem }
      ];
      
      let success = true;
      for (const update of updates) {
        const updated = await updateMessageOrder(update.id, update.ordem);
        if (!updated) {
          success = false;
          break;
        }
      }
      
      if (success) {
        const newMessages = [...messages];
        newMessages[index] = { ...newMessages[index], ordem: nextMessage.ordem };
        newMessages[index + 1] = { ...newMessages[index + 1], ordem: message.ordem };
        
        newMessages.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        setMessages(newMessages);
        
        toast.success("Ordem atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error moving message down:", error);
      toast.error("Erro ao atualizar ordem da mensagem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (message: PixMensagem) => {
    try {
      setIsSaving(true);
      
      const updatedMessage = await updateMessage(message.id, { 
        ativo: !message.ativo 
      });
        
      if (updatedMessage) {
        setMessages(messages.map(msg => 
          msg.id === message.id ? updatedMessage : msg
        ));
        toast.success(`Mensagem ${updatedMessage.ativo ? 'ativada' : 'desativada'} com sucesso`);
      }
    } catch (error) {
      console.error("Error toggling message status:", error);
      toast.error("Erro ao alterar status da mensagem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMessage = (message: PixMensagem) => {
    setEditingMessage(message);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleUpdateEditingMessage = (field: string, value: string | boolean) => {
    if (editingMessage) {
      setEditingMessage({...editingMessage, [field]: value});
    }
  };

  const handleUpdateNewMessage = (field: string, value: string | boolean) => {
    setNewMessage({...newMessage, [field]: value});
  };

  return {
    messages,
    loading,
    editingMessage,
    newMessage,
    isSaving,
    handleCreateMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    handleMoveUp,
    handleMoveDown,
    handleToggleActive,
    handleEditMessage,
    handleCancelEdit,
    handleUpdateEditingMessage,
    handleUpdateNewMessage,
    refreshMessages: loadMessages
  };
};
