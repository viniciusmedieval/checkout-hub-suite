
import { useState } from "react";

// Cliente type
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  celular: string;
  documento: string;
  produto_id: number;
  produto_nome: string;
  criado_em: string;
}

// Mock data
const mockClientes = [
  { 
    id: 1, 
    nome: "João Silva", 
    email: "joao@email.com", 
    celular: "(11) 99999-8888", 
    documento: "123.456.789-00", 
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    criado_em: "2023-05-10T14:32:00Z"
  },
  { 
    id: 2, 
    nome: "Maria Oliveira", 
    email: "maria@email.com", 
    celular: "(21) 98888-7777", 
    documento: "987.654.321-00", 
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    criado_em: "2023-05-11T09:15:00Z"
  },
  { 
    id: 3, 
    nome: "Carlos Santos", 
    email: "carlos@email.com", 
    celular: "(31) 97777-6666", 
    documento: "456.789.123-00", 
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    criado_em: "2023-05-12T16:45:00Z"
  },
  { 
    id: 4, 
    nome: "Ana Pereira", 
    email: "ana@email.com", 
    celular: "(41) 96666-5555", 
    documento: "789.123.456-00", 
    produto_id: 3,
    produto_nome: "Mentorias de Vendas",
    criado_em: "2023-05-13T11:20:00Z"
  },
  { 
    id: 5, 
    nome: "Paulo Souza", 
    email: "paulo@email.com", 
    celular: "(51) 95555-4444", 
    documento: "321.654.987-00", 
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    criado_em: "2023-05-14T13:50:00Z"
  },
];

export const useClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);

  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.celular.includes(searchTerm) ||
    cliente.documento.includes(searchTerm)
  );

  return {
    clientes,
    setClientes,
    searchTerm,
    setSearchTerm,
    filteredClientes
  };
};
