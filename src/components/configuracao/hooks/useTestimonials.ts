
import { useState, useEffect } from 'react';
import { Depoimento } from '@/lib/types/database-types';
import { toast } from 'sonner';
import { fetchTestimonials, deleteTestimonial as deleteTestimonialService, addTestimonial as addTestimonialService, updateTestimonial as updateTestimonialService } from '../services';

export const useTestimonials = (initialDepoimentos: Depoimento[] = []) => {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initialDepoimentos);
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar com depoimentos iniciais quando eles mudarem
  useEffect(() => {
    console.log("useTestimonials - initialDepoimentos atualizado:", initialDepoimentos);
    if (Array.isArray(initialDepoimentos) && initialDepoimentos.length > 0) {
      setDepoimentos(initialDepoimentos);
    }
  }, [initialDepoimentos]);

  const handleDeleteTestimonial = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🗑️ Excluindo depoimento ID:", id);
      
      // Utilizar o serviço para excluir o depoimento
      const success = await deleteTestimonialService(id);
      
      if (success) {
        // Update local state
        setDepoimentos(prev => prev.filter(depoimento => depoimento.id !== id));
        console.log("✅ Depoimento excluído com sucesso!");
      } else {
        throw new Error("Falha ao excluir depoimento");
      }
    } catch (error: any) {
      console.error('❌ Erro ao excluir depoimento:', error);
      toast.error(`Erro ao excluir depoimento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("➕ Adicionando novo depoimento:", depoimento);
      
      // Utilizar o serviço para adicionar o depoimento
      const novoDepoimento = await addTestimonialService(depoimento);
      
      if (novoDepoimento) {
        // Update local state with the new testimonial
        setDepoimentos(prev => [...prev, novoDepoimento]);
        console.log("✅ Depoimento adicionado com sucesso:", novoDepoimento);
      } else {
        throw new Error("Falha ao adicionar depoimento");
      }
    } catch (error: any) {
      console.error('❌ Erro ao adicionar depoimento:', error);
      toast.error(`Erro ao adicionar depoimento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTestimonial = async (id: number, depoimento: Partial<Depoimento>): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🔄 Atualizando depoimento ID:", id, depoimento);
      
      // Utilizar o serviço para atualizar o depoimento
      const depoimentoAtualizado = await updateTestimonialService(id, depoimento);
      
      if (depoimentoAtualizado) {
        // Update local state
        setDepoimentos(prev => 
          prev.map(item => item.id === id ? depoimentoAtualizado : item)
        );
        console.log("✅ Depoimento atualizado com sucesso:", depoimentoAtualizado);
      } else {
        throw new Error("Falha ao atualizar depoimento");
      }
    } catch (error: any) {
      console.error('❌ Erro ao atualizar depoimento:', error);
      toast.error(`Erro ao atualizar depoimento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadTestimonials = async (produtoId?: number): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🔄 Recarregando depoimentos...");
      
      const depoimentosData = await fetchTestimonials(produtoId);
      
      if (depoimentosData) {
        setDepoimentos(depoimentosData);
        console.log("✅ Depoimentos recarregados com sucesso:", depoimentosData);
      }
    } catch (error: any) {
      console.error('❌ Erro ao recarregar depoimentos:', error);
      toast.error(`Erro ao recarregar depoimentos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    depoimentos,
    setDepoimentos,
    isLoading,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial,
    reloadTestimonials
  };
};
