
import { useState } from "react";

// Mock data
const mockVendas = [
  { 
    id: 1, 
    cliente_id: 1, 
    cliente_nome: "João Silva",
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    valor: 297.00,
    status: "aprovado",
    metodo_pagamento: "pix",
    criado_em: "2023-05-10T14:32:00Z"
  },
  { 
    id: 2, 
    cliente_id: 2, 
    cliente_nome: "Maria Oliveira",
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    valor: 47.00,
    status: "aprovado",
    metodo_pagamento: "cartao",
    criado_em: "2023-05-11T09:15:00Z"
  },
  { 
    id: 3, 
    cliente_id: 3, 
    cliente_nome: "Carlos Santos",
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    valor: 297.00,
    status: "pendente",
    metodo_pagamento: "boleto",
    criado_em: "2023-05-12T16:45:00Z"
  },
  { 
    id: 4, 
    cliente_id: 4, 
    cliente_nome: "Ana Pereira",
    produto_id: 3,
    produto_nome: "Mentorias de Vendas",
    valor: 997.00,
    status: "recusado",
    metodo_pagamento: "cartao",
    criado_em: "2023-05-13T11:20:00Z"
  },
  { 
    id: 5, 
    cliente_id: 5, 
    cliente_nome: "Paulo Souza",
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    valor: 47.00,
    status: "aprovado",
    metodo_pagamento: "pix",
    criado_em: "2023-05-14T13:50:00Z"
  },
];

export interface Venda {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  produto_id: number;
  produto_nome: string;
  valor: number;
  status: string;
  metodo_pagamento: string;
  criado_em: string;
}

export const useVendas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [vendas] = useState<Venda[]>(mockVendas);

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = 
      venda.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.valor.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || venda.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return {
    vendas: filteredVendas,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
  };
};
