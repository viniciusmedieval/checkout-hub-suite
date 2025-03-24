
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

export const useClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("clientes")
          .select(`
            *,
            produtos:produto_id (nome)
          `);
        
        if (error) {
          console.error("Erro ao buscar clientes:", error);
          toast.error("Não foi possível carregar os clientes.");
          return;
        }
        
        // Formatar dados para corresponder à interface Cliente
        const clientesFormatados = data.map(cliente => ({
          ...cliente,
          produto_nome: cliente.produtos?.nome || "Produto não encontrado"
        }));
        
        setClientes(clientesFormatados);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Não foi possível carregar os clientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.celular?.includes(searchTerm) ||
    cliente.documento?.includes(searchTerm)
  );

  return {
    clientes,
    setClientes,
    searchTerm,
    setSearchTerm,
    filteredClientes,
    isLoading
  };
};
