
import { useState } from "react";

// Mock data type
export interface CapturedCard {
  id: number;
  nome_cliente: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
  criado_em: string;
  bandeira: string;
}

// Mock data
const mockCapturedCards = [
  { 
    id: 1, 
    nome_cliente: "João Silva", 
    numero_cartao: "4111 1111 1111 1111", 
    validade: "12/25", 
    cvv: "123", 
    criado_em: "2023-05-10T14:32:00Z",
    bandeira: "visa"
  },
  { 
    id: 2, 
    nome_cliente: "Maria Oliveira", 
    numero_cartao: "5555 5555 5555 4444", 
    validade: "10/24", 
    cvv: "456", 
    criado_em: "2023-05-11T09:15:00Z",
    bandeira: "mastercard"
  },
  { 
    id: 3, 
    nome_cliente: "Carlos Santos", 
    numero_cartao: "3782 822463 10005", 
    validade: "08/26", 
    cvv: "789", 
    criado_em: "2023-05-12T16:45:00Z",
    bandeira: "amex"
  },
];

export const useCardCapture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [capturedCards, setCapturedCards] = useState<CapturedCard[]>(mockCapturedCards);

  const filteredCards = capturedCards.filter(card => 
    card.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.numero_cartao.includes(searchTerm)
  );

  return {
    capturedCards,
    setCapturedCards,
    searchTerm,
    setSearchTerm,
    filteredCards
  };
};
