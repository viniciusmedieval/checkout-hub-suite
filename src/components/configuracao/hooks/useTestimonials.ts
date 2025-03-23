
import { useState } from "react";
import { Depoimento } from "@/lib/supabase";
import { deleteTestimonial, addTestimonial } from "../services/configServices";

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
    handleAddTestimonial
  };
}
