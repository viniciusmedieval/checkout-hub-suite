
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface DashboardData {
  totalClientes: number;
  produtosAtivos: number;
  receitaTotal: number;
  taxaConversao: number;
  isLoading: boolean;
}

export const useDashboardData = (): DashboardData => {
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [produtosAtivos, setProdutosAtivos] = useState<number>(0);
  const [receitaTotal, setReceitaTotal] = useState<number>(0);
  const [taxaConversao, setTaxaConversao] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResumoDashboard = async () => {
      setIsLoading(true);
      try {
        // Buscar clientes
        const { data: clientes, error: clientesError } = await supabase.from('clientes').select('*');
        if (clientesError) throw clientesError;
        setTotalClientes(clientes?.length || 0);

        // Buscar produtos ativos
        const { data: produtos, error: produtosError } = await supabase.from('produtos').select('*').eq('ativo', true);
        if (produtosError) throw produtosError;
        setProdutosAtivos(produtos?.length || 0);

        // Buscar vendas para calcular receita total
        const { data: vendas, error: vendasError } = await supabase.from('vendas').select('*').eq('status', 'aprovado');
        if (vendasError) throw vendasError;
        
        // Calcular receita total
        const receita = vendas?.reduce((acc, venda) => acc + (venda.valor || 0), 0) || 0;
        setReceitaTotal(receita);

        // Calcular taxa de conversão (vendas / clientes)
        if (clientes?.length > 0) {
          const taxa = (vendas?.length || 0) / clientes.length * 100;
          setTaxaConversao(parseFloat(taxa.toFixed(1)));
        } else {
          setTaxaConversao(0);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumoDashboard();
  }, []);

  return {
    totalClientes,
    produtosAtivos,
    receitaTotal,
    taxaConversao,
    isLoading
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
