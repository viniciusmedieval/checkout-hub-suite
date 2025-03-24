
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("vendas")
          .select(`
            *,
            clientes:cliente_id (nome),
            produtos:produto_id (nome)
          `);
        
        if (error) {
          console.error("Erro ao buscar vendas:", error);
          toast.error("Não foi possível carregar as vendas.");
          return;
        }
        
        // Formatar dados para corresponder à interface Venda
        const vendasFormatadas = data.map(venda => ({
          ...venda,
          cliente_nome: venda.clientes?.nome || "Cliente não encontrado",
          produto_nome: venda.produtos?.nome || "Produto não encontrado"
        }));
        
        setVendas(vendasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
        toast.error("Não foi possível carregar as vendas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendas();
  }, []);

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
    setStatusFilter,
    isLoading
  };
};
