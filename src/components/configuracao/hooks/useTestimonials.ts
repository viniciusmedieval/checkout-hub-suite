
import { useState } from 'react';
import { Depoimento } from '@/lib/types/database-types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useTestimonials = (initialDepoimentos: Depoimento[] = []) => {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initialDepoimentos);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTestimonial = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('depoimentos')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setDepoimentos(prev => prev.filter(depoimento => depoimento.id !== id));
      toast.success('Depoimento excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir depoimento:', error);
      toast.error(`Erro ao excluir depoimento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('depoimentos')
        .insert([depoimento])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update local state with the new testimonial
        setDepoimentos(prev => [...prev, data[0]]);
        toast.success('Depoimento adicionado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar depoimento:', error);
      toast.error(`Erro ao adicionar depoimento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTestimonial = async (id: number, depoimento: Partial<Depoimento>): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('depoimentos')
        .update(depoimento)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update local state
        setDepoimentos(prev => 
          prev.map(item => item.id === id ? { ...item, ...data[0] } : item)
        );
        toast.success('Depoimento atualizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar depoimento:', error);
      toast.error(`Erro ao atualizar depoimento: ${error.message}`);
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
    handleUpdateTestimonial
  };
};
