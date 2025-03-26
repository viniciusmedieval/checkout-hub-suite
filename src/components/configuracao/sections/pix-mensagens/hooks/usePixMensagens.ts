
import { useState, useEffect } from "react";
import { PixMensagem } from "@/lib/types/database-types";
import { toast } from "sonner";
import { 
  pixMensagensService 
} from "../services/pixMensagensService";

export const usePixMensagens = () => {
  const [mensagens, setMensagens] = useState<PixMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMensagem, setEditingMensagem] = useState<PixMensagem | null>(null);
  const [newMensagem, setNewMensagem] = useState<Partial<PixMensagem>>({
    chave: "",
    titulo: "",
    texto: "",
    ativo: true,
    ordem: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadMensagens = async () => {
    setLoading(true);
    try {
      const data = await pixMensagensService.fetchMessages();
      setMensagens(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erro ao carregar mensagens PIX");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMensagens();
  }, []);

  const handleCreateMensagem = async () => {
    try {
      if (!newMensagem.chave || !newMensagem.titulo || !newMensagem.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);
      
      if (!newMensagem.ordem) {
        newMensagem.ordem = mensagens.length > 0 
          ? Math.max(...mensagens.map(msg => msg.ordem || 0)) + 1 
          : 1;
      }

      const createdMensagem = await pixMensagensService.createMessage({
        chave: newMensagem.chave!,
        titulo: newMensagem.titulo!,
        texto: newMensagem.texto!,
        ativo: newMensagem.ativo ?? true,
        ordem: newMensagem.ordem
      });

      if (createdMensagem) {
        setMensagens([...mensagens, createdMensagem]);
        setNewMensagem({
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

  const handleUpdateMensagem = async () => {
    try {
      if (!editingMensagem || !editingMensagem.id) {
        toast.error("Nenhuma mensagem selecionada para edição");
        return;
      }

      if (!editingMensagem.chave || !editingMensagem.titulo || !editingMensagem.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);
      
      const updatedMensagem = await pixMensagensService.updateMessage(editingMensagem.id, {
        chave: editingMensagem.chave,
        titulo: editingMensagem.titulo,
        texto: editingMensagem.texto,
        ativo: editingMensagem.ativo,
        ordem: editingMensagem.ordem
      });

      if (updatedMensagem) {
        setMensagens(mensagens.map(msg => 
          msg.id === editingMensagem.id ? updatedMensagem : msg
        ));
        setEditingMensagem(null);
        toast.success("Mensagem PIX atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Erro ao atualizar mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMensagem = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
        return;
      }

      setIsSaving(true);
      
      const success = await pixMensagensService.deleteMessage(id);

      if (success) {
        setMensagens(mensagens.filter(msg => msg.id !== id));
        toast.success("Mensagem PIX excluída com sucesso");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Erro ao excluir mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUp = async (mensagem: PixMensagem) => {
    try {
      const index = mensagens.findIndex(msg => msg.id === mensagem.id);
      if (index <= 0) return; // Already at the top
      
      setIsSaving(true);
      
      const previousMensagem = mensagens[index - 1];
      
      const updates = [
        { id: mensagem.id, ordem: previousMensagem.ordem },
        { id: previousMensagem.id, ordem: mensagem.ordem }
      ];
      
      let success = true;
      for (const update of updates) {
        const updated = await pixMensagensService.updateMessageOrder(update.id, update.ordem);
        if (!updated) {
          success = false;
          break;
        }
      }
      
      if (success) {
        const newMensagens = [...mensagens];
        newMensagens[index] = { ...newMensagens[index], ordem: previousMensagem.ordem };
        newMensagens[index - 1] = { ...newMensagens[index - 1], ordem: mensagem.ordem };
        
        newMensagens.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        setMensagens(newMensagens);
        
        toast.success("Ordem atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error moving message up:", error);
      toast.error("Erro ao atualizar ordem da mensagem");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMoveDown = async (mensagem: PixMensagem) => {
    try {
      const index = mensagens.findIndex(msg => msg.id === mensagem.id);
      if (index >= mensagens.length - 1) return; // Already at the bottom
      
      setIsSaving(true);
      
      const nextMensagem = mensagens[index + 1];
      
      const updates = [
        { id: mensagem.id, ordem: nextMensagem.ordem },
        { id: nextMensagem.id, ordem: mensagem.ordem }
      ];
      
      let success = true;
      for (const update of updates) {
        const updated = await pixMensagensService.updateMessageOrder(update.id, update.ordem);
        if (!updated) {
          success = false;
          break;
        }
      }
      
      if (success) {
        const newMensagens = [...mensagens];
        newMensagens[index] = { ...newMensagens[index], ordem: nextMensagem.ordem };
        newMensagens[index + 1] = { ...newMensagens[index + 1], ordem: mensagem.ordem };
        
        newMensagens.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        setMensagens(newMensagens);
        
        toast.success("Ordem atualizada com sucesso");
      }
    } catch (error) {
      console.error("Error moving message down:", error);
      toast.error("Erro ao atualizar ordem da mensagem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (mensagem: PixMensagem) => {
    try {
      setIsSaving(true);
      
      const updatedMensagem = await pixMensagensService.updateMessage(mensagem.id, { 
        ativo: !mensagem.ativo 
      });
        
      if (updatedMensagem) {
        setMensagens(mensagens.map(msg => 
          msg.id === mensagem.id ? updatedMensagem : msg
        ));
        toast.success(`Mensagem ${updatedMensagem.ativo ? 'ativada' : 'desativada'} com sucesso`);
      }
    } catch (error) {
      console.error("Error toggling message status:", error);
      toast.error("Erro ao alterar status da mensagem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMensagem = (mensagem: PixMensagem) => {
    setEditingMensagem(mensagem);
  };

  const handleCancelEdit = () => {
    setEditingMensagem(null);
  };

  const handleUpdateEditingMensagem = (field: string, value: string | boolean) => {
    if (editingMensagem) {
      setEditingMensagem({...editingMensagem, [field]: value});
    }
  };

  const handleUpdateNewMensagem = (field: string, value: string | boolean) => {
    setNewMensagem({...newMensagem, [field]: value});
  };

  return {
    mensagens,
    loading,
    editingMensagem,
    newMensagem,
    isSaving,
    handleCreateMensagem,
    handleUpdateMensagem,
    handleDeleteMensagem,
    handleMoveUp,
    handleMoveDown,
    handleToggleActive,
    handleEditMensagem,
    handleCancelEdit,
    handleUpdateEditingMensagem,
    handleUpdateNewMensagem,
    refreshMensagens: loadMensagens
  };
};
