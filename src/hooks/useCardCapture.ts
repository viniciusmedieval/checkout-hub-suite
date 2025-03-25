
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CardCapture } from "@/lib/types/database-types";

// Card capture type with bandeira
export interface CapturedCard extends CardCapture {
  bandeira: string;
}

// Function to detect card brand based on number
const detectCardBrand = (cardNumber: string): string => {
  const cleanedNumber = cardNumber.replace(/\s+/g, '');
  
  // Added support for Elo cards (Brazilian brand)
  if (/^4/.test(cleanedNumber)) return "visa";
  if (/^5[1-5]/.test(cleanedNumber)) return "mastercard";
  if (/^3[47]/.test(cleanedNumber)) return "amex";
  if (/^6(?:011|5)/.test(cleanedNumber)) return "discover";
  if (/^(?:2131|1800|35)/.test(cleanedNumber)) return "jcb";
  if (/^3(?:0[0-5]|[68])/.test(cleanedNumber)) return "diners";
  if (/^6[0-9]{15}/.test(cleanedNumber)) return "elo"; // Added Elo detection
  
  return "desconhecida";
};

export const useCardCapture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [capturedCards, setCapturedCards] = useState<CapturedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching card captures...");
      
      const { data, error } = await supabase
        .from("card_captures")
        .select("*")
        .order("criado_em", { ascending: false });
      
      if (error) {
        console.error("Error fetching cards:", error);
        setError(error.message);
        toast.error("Falha ao carregar dados de cartões.");
        return;
      }
      
      console.log("Card captures fetched:", data);
      
      if (!data || data.length === 0) {
        console.log("No card data found in database");
      }
      
      // Add card brand based on number
      const cardsWithBrand = data.map(card => ({
        ...card,
        bandeira: detectCardBrand(card.numero_cartao)
      }));
      
      setCapturedCards(cardsWithBrand);
      toast.success(`${cardsWithBrand.length} cartões carregados com sucesso`);
    } catch (error) {
      console.error("Unexpected error fetching cards:", error);
      setError("Erro inesperado ocorreu");
      toast.error("Falha ao carregar dados de cartões. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const filteredCards = capturedCards.filter(card => 
    card.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.numero_cartao.includes(searchTerm) ||
    card.bandeira.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshCards = () => {
    fetchCards();
  };

  // Add delete functionality for a single card
  const deleteCard = async (id: number) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from("card_captures")
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting card:", error);
        toast.error("Falha ao apagar cartão.");
        return;
      }
      
      setCapturedCards(prev => prev.filter(card => card.id !== id));
      toast.success("Cartão apagado com sucesso");
    } catch (error) {
      console.error("Unexpected error deleting card:", error);
      toast.error("Falha ao apagar cartão. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add delete all cards functionality
  const deleteAllCards = async () => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from("card_captures")
        .delete()
        .neq('id', 0); // Delete all records
      
      if (error) {
        console.error("Error deleting all cards:", error);
        toast.error("Falha ao apagar todos os cartões.");
        return;
      }
      
      setCapturedCards([]);
      toast.success("Todos os cartões foram apagados com sucesso");
    } catch (error) {
      console.error("Unexpected error deleting all cards:", error);
      toast.error("Falha ao apagar todos os cartões. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    capturedCards,
    setCapturedCards,
    searchTerm,
    setSearchTerm,
    filteredCards,
    isLoading,
    error,
    refreshCards,
    deleteCard,
    deleteAllCards,
    deleteLoading
  };
};
