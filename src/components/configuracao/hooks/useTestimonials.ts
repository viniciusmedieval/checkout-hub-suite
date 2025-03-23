
import { useState } from "react";
import { Depoimento } from "@/lib/supabase";
import { toast } from "sonner";
import { deleteTestimonial, addTestimonial } from "../services/configServices";

export function useTestimonials(initialDepoimentos: Depoimento[] = []) {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>(initialDepoimentos);
  const [depoimentosSaving, setDepoimentosSaving] = useState(false);

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    
    setDepoimentosSaving(true);
    try {
      await deleteTestimonial(id);
      
      setDepoimentos(prev => prev.filter(dep => dep.id !== id));
      toast.success("Depoimento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Erro ao excluir depoimento. Tente novamente.");
    } finally {
      setDepoimentosSaving(false);
    }
  };

  const handleAddTestimonial = async (depoimento: Omit<Depoimento, "id" | "criado_em">) => {
    setDepoimentosSaving(true);
    try {
      const newDepoimento = await addTestimonial(depoimento);
      
      setDepoimentos(prev => [newDepoimento, ...prev]);
      toast.success("Depoimento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar depoimento:", error);
      toast.error("Erro ao adicionar depoimento. Tente novamente.");
    } finally {
      setDepoimentosSaving(false);
    }
  };

  return {
    depoimentos,
    setDepoimentos,
    depoimentosSaving,
    handleDeleteTestimonial,
    handleAddTestimonial
  };
}
