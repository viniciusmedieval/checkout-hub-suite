
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ChartData {
  name: string;
  valor?: number;
  vendas?: number;
  clientes?: number;
  cartoes?: number;
  pix?: number;
}

export interface DashboardData {
  totalClientes: number;
  produtosAtivos: number;
  receitaTotal: number;
  taxaConversao: number;
  isLoading: boolean;
  salesVsCustomersData: ChartData[];
  topProductsData: ChartData[];
  cardCaptureData: ChartData[];
  pixGeneratedData: ChartData[];
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export const useDashboardData = (): DashboardData => {
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [produtosAtivos, setProdutosAtivos] = useState<number>(0);
  const [receitaTotal, setReceitaTotal] = useState<number>(0);
  const [taxaConversao, setTaxaConversao] = useState<number>(0);
  const [salesVsCustomersData, setSalesVsCustomersData] = useState<ChartData[]>([]);
  const [topProductsData, setTopProductsData] = useState<ChartData[]>([]);
  const [cardCaptureData, setCardCaptureData] = useState<ChartData[]>([]);
  const [pixGeneratedData, setPixGeneratedData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Date range filter
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 6)));
  const [endDate, setEndDate] = useState<Date>(new Date());

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
        
        // Fetch data for Sales vs Customers chart
        await fetchSalesVsCustomers();
        
        // Fetch data for Top Products chart
        await fetchTopProducts();
        
        // Fetch data for Card Capture chart
        await fetchCardCaptures();
        
        // Fetch data for PIX Generated chart
        await fetchPixGenerated();
        
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchSalesVsCustomers = async () => {
      try {
        // Format date range for query
        const start = startDate.toISOString();
        const end = endDate.toISOString();
        
        // Get monthly data for the last 6 months
        const monthLabels = getMonthLabels(startDate, endDate);
        
        // Query vendas and clientes in date range
        const { data: vendas } = await supabase
          .from('vendas')
          .select('*')
          .gte('criado_em', start)
          .lte('criado_em', end);
          
        const { data: clientes } = await supabase
          .from('clientes')
          .select('*')
          .gte('criado_em', start)
          .lte('criado_em', end);
          
        // Group data by month
        const chartData = monthLabels.map(monthLabel => {
          const [month, year] = monthLabel.split('/');
          const monthNum = parseInt(month) - 1; // JS months are 0-indexed
          const yearNum = parseInt(year);
          
          const monthVendas = vendas?.filter(venda => {
            const vendaDate = new Date(venda.criado_em);
            return vendaDate.getMonth() === monthNum && vendaDate.getFullYear() === yearNum;
          }) || [];
          
          const monthClientes = clientes?.filter(cliente => {
            const clienteDate = new Date(cliente.criado_em);
            return clienteDate.getMonth() === monthNum && clienteDate.getFullYear() === yearNum;
          }) || [];
          
          return {
            name: monthLabel,
            vendas: monthVendas.length,
            clientes: monthClientes.length
          };
        });
        
        setSalesVsCustomersData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados de vendas vs clientes:', error);
        setSalesVsCustomersData([]);
      }
    };
    
    const fetchTopProducts = async () => {
      try {
        // Format date range for query
        const start = startDate.toISOString();
        const end = endDate.toISOString();
        
        // Get approved sales with product data
        const { data: vendas } = await supabase
          .from('vendas')
          .select('*, produto:produto_id(*)')
          .eq('status', 'aprovado')
          .gte('criado_em', start)
          .lte('criado_em', end);
          
        if (!vendas || vendas.length === 0) {
          setTopProductsData([]);
          return;
        }
        
        // Group by product and sum values
        const productSummary = vendas.reduce((acc, venda) => {
          const produto = venda.produto as any; // Type as any for simplicity
          if (!produto) return acc;
          
          if (!acc[produto.id]) {
            acc[produto.id] = {
              name: produto.nome,
              valor: 0
            };
          }
          
          acc[produto.id].valor += venda.valor || 0;
          return acc;
        }, {} as Record<string, ChartData>);
        
        // Convert to array and sort by value
        const topProducts = Object.values(productSummary)
          .sort((a, b) => (b.valor || 0) - (a.valor || 0))
          .slice(0, 5); // Get top 5
          
        setTopProductsData(topProducts);
      } catch (error) {
        console.error('Erro ao buscar dados de produtos mais vendidos:', error);
        setTopProductsData([]);
      }
    };
    
    const fetchCardCaptures = async () => {
      try {
        // Format date range for query
        const start = startDate.toISOString();
        const end = endDate.toISOString();
        
        // Get monthly data
        const monthLabels = getMonthLabels(startDate, endDate);
        
        // Query card_capture in date range
        const { data: cardCaptures } = await supabase
          .from('card_capture')
          .select('*')
          .gte('criado_em', start)
          .lte('criado_em', end);
          
        // Group data by month
        const chartData = monthLabels.map(monthLabel => {
          const [month, year] = monthLabel.split('/');
          const monthNum = parseInt(month) - 1; // JS months are 0-indexed
          const yearNum = parseInt(year);
          
          const monthCards = cardCaptures?.filter(card => {
            const cardDate = new Date(card.criado_em);
            return cardDate.getMonth() === monthNum && cardDate.getFullYear() === yearNum;
          }) || [];
          
          return {
            name: monthLabel,
            cartoes: monthCards.length
          };
        });
        
        setCardCaptureData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados de cartões capturados:', error);
        setCardCaptureData([]);
      }
    };
    
    const fetchPixGenerated = async () => {
      try {
        // Format date range for query
        const start = startDate.toISOString();
        const end = endDate.toISOString();
        
        // Get monthly data
        const monthLabels = getMonthLabels(startDate, endDate);
        
        // Query vendas with PIX payment in date range
        const { data: pixVendas } = await supabase
          .from('vendas')
          .select('*')
          .eq('metodo_pagamento', 'pix')
          .gte('criado_em', start)
          .lte('criado_em', end);
          
        // Group data by month
        const chartData = monthLabels.map(monthLabel => {
          const [month, year] = monthLabel.split('/');
          const monthNum = parseInt(month) - 1; // JS months are 0-indexed
          const yearNum = parseInt(year);
          
          const monthPix = pixVendas?.filter(venda => {
            const vendaDate = new Date(venda.criado_em);
            return vendaDate.getMonth() === monthNum && vendaDate.getFullYear() === yearNum;
          }) || [];
          
          return {
            name: monthLabel,
            pix: monthPix.length
          };
        });
        
        setPixGeneratedData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados de PIX gerados:', error);
        setPixGeneratedData([]);
      }
    };
    
    // Helper function to get array of month labels
    const getMonthLabels = (start: Date, end: Date): string[] => {
      const labels: string[] = [];
      const current = new Date(start);
      current.setDate(1); // Start at the first day of the month
      
      while (current <= end) {
        const month = current.getMonth() + 1; // JS months are 0-indexed
        const year = current.getFullYear();
        labels.push(`${month.toString().padStart(2, '0')}/${year}`);
        current.setMonth(current.getMonth() + 1);
      }
      
      return labels;
    };

    fetchResumoDashboard();
  }, [startDate, endDate]);

  return {
    totalClientes,
    produtosAtivos,
    receitaTotal,
    taxaConversao,
    isLoading,
    salesVsCustomersData,
    topProductsData,
    cardCaptureData,
    pixGeneratedData,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
