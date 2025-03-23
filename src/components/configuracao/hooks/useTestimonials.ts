
import { useState } from "react";
import { Depoimento } from "@/lib/supabase";
import { deleteTestimonial, addTestimonial, updateTestimonial } from "../services";
import { toast } from "sonner";

export function useTestimonials(initialDepoimentos: Depoimento[] = []) {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initialDepoimentos);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    
    setIsLoading(true);
    try {
      const success = await deleteTestimonial(id);
      
      if (success) {
        setDepoimentos(prev => prev.filter(dep => dep.id !== id));
        toast.success("Depoimento excluído com sucesso!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">) => {
    setIsLoading(true);
    try {
      const newDepoimento = await addTestimonial(depoimento);
      
      if (newDepoimento) {
        setDepoimentos(prev => [newDepoimento, ...prev]);
        toast.success("Depoimento adicionado com sucesso!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateTestimonial = async (id: number, depoimento: Partial<Depoimento>) => {
    setIsLoading(true);
    try {
      const updatedDepoimento = await updateTestimonial(id, depoimento);
      
      if (updatedDepoimento) {
        setDepoimentos(prev => 
          prev.map(dep => dep.id === id ? updatedDepoimento : dep)
        );
        toast.success("Depoimento atualizado com sucesso!");
      }
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
}
