
import { useState, useEffect } from "react";
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
  
  if (/^4/.test(cleanedNumber)) return "visa";
  if (/^5[1-5]/.test(cleanedNumber)) return "mastercard";
  if (/^3[47]/.test(cleanedNumber)) return "amex";
  if (/^6(?:011|5)/.test(cleanedNumber)) return "discover";
  if (/^(?:2131|1800|35)/.test(cleanedNumber)) return "jcb";
  if (/^3(?:0[0-5]|[68])/.test(cleanedNumber)) return "diners";
  
  return "desconhecida";
};

export const useCardCapture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [capturedCards, setCapturedCards] = useState<CapturedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
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
        toast.error("Failed to load card data.");
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
    } catch (error) {
      console.error("Unexpected error fetching cards:", error);
      setError("Unexpected error occurred");
      toast.error("Failed to load card data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards = capturedCards.filter(card => 
    card.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.numero_cartao.includes(searchTerm)
  );

  const refreshCards = () => {
    fetchCards();
  };

  return {
    capturedCards,
    setCapturedCards,
    searchTerm,
    setSearchTerm,
    filteredCards,
    isLoading,
    error,
    refreshCards
  };
};
