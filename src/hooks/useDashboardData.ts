
import { useState, useEffect } from 'react';
import { startOfMonth, subMonths, startOfDay, format, subDays } from 'date-fns';
import { supabase, Venda, Produto } from '@/lib/supabase';

// Type definitions
export type ChartData = {
  name: string;
  valor: number;
  quantidade?: number;
};

export type DashboardStats = {
  totalClientes: number;
  produtosAtivos: number;
  totalVendas: number;
  taxaConversao: number;
  loading: boolean;
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

// Format currency helper
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Custom hook for dashboard data
export function useDashboardData() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [produtosAtivos, setProdutosAtivos] = useState(0);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [taxaConversao, setTaxaConversao] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [salesVsCustomersData, setSalesVsCustomersData] = useState<ChartData[]>([]);
  const [topProductsData, setTopProductsData] = useState<ChartData[]>([]);
  const [pixGeneratedData, setPixGeneratedData] = useState<ChartData[]>([]);
  const [cardCaptureData, setCardCaptureData] = useState<ChartData[]>([]);
  
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Function to fetch dashboard summary stats
  const fetchDashboardStats = async () => {
    try {
      // Fetch total clients
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('id');
      
      if (clientesError) throw clientesError;
      
      // Fetch active products
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('id')
        .eq('ativo', true);
      
      if (produtosError) throw produtosError;
      
      // Fetch total sales amount
      const { data: vendasData, error: vendasError } = await supabase
        .from('vendas')
        .select('valor');
      
      if (vendasError) throw vendasError;
      
      // Calculate total sales amount
      const totalVendasValor = vendasData.reduce((sum, venda) => sum + (venda.valor || 0), 0);
      
      // Calculate conversion rate (assumindo que é vendas / clientes)
      const conversao = clientesData.length > 0 
        ? (vendasData.length / clientesData.length) * 100 
        : 0;
      
      // Update stats state
      setTotalClientes(clientesData.length || 0);
      setProdutosAtivos(produtosData.length || 0);
      setReceitaTotal(totalVendasValor || 0);
      setTaxaConversao(parseFloat(conversao.toFixed(2)) || 0);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setIsLoading(false);
    }
  };

  // Function to fetch sales vs customers data for the chart
  const fetchSalesVsCustomersData = async () => {
    try {
      // Format the date range for query
      const fromDate = startDate ? format(startDate, 'yyyy-MM-dd') : format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
      const toDate = endDate ? format(endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
      // Fetch sales data for the date range
      const { data: vendasData, error: vendasError } = await supabase
        .from('vendas')
        .select('valor, criado_em')
        .gte('criado_em', `${fromDate}T00:00:00`)
        .lte('criado_em', `${toDate}T23:59:59`);
      
      if (vendasError) throw vendasError;
      
      // Fetch customers data for the date range
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('id, criado_em')
        .gte('criado_em', `${fromDate}T00:00:00`)
        .lte('criado_em', `${toDate}T23:59:59`);
      
      if (clientesError) throw clientesError;
      
      // Group data by date for the chart
      const groupedData: Record<string, { vendas: number; clientes: number }> = {};
      
      // Group sales by date
      vendasData.forEach(venda => {
        const date = format(new Date(venda.criado_em), 'dd/MM');
        if (!groupedData[date]) {
          groupedData[date] = { vendas: 0, clientes: 0 };
        }
        groupedData[date].vendas += venda.valor;
      });
      
      // Group customers by date
      clientesData.forEach(cliente => {
        const date = format(new Date(cliente.criado_em), 'dd/MM');
        if (!groupedData[date]) {
          groupedData[date] = { vendas: 0, clientes: 0 };
        }
        groupedData[date].clientes += 1;
      });
      
      // Convert grouped data to chart format
      const chartData: ChartData[] = Object.keys(groupedData).map(date => ({
        name: date,
        valor: groupedData[date].vendas,
        quantidade: groupedData[date].clientes
      }));
      
      // Sort by date (day/month format)
      chartData.sort((a, b) => {
        const [dayA, monthA] = a.name.split('/').map(Number);
        const [dayB, monthB] = b.name.split('/').map(Number);
        return (monthA - monthB) || (dayA - dayB);
      });
      
      setSalesVsCustomersData(chartData);
      
    } catch (error) {
      console.error('Error fetching sales vs customers data:', error);
      setSalesVsCustomersData([]);
    }
  };

  // Function to fetch top products data for the chart
  const fetchTopProductsData = async () => {
    try {
      // Format the date range for query
      const fromDate = startDate ? format(startDate, 'yyyy-MM-dd') : format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
      const toDate = endDate ? format(endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
      // Fetch sales and join with products to get product names
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          valor,
          produtos:produto_id (id, nome)
        `)
        .gte('criado_em', `${fromDate}T00:00:00`)
        .lte('criado_em', `${toDate}T23:59:59`);
      
      if (error) throw error;
      
      // Group sales by product
      const productSales: Record<string, { id: number; nome: string; total: number }> = {};
      
      data.forEach(venda => {
        if (venda.produtos) {
          // Fix: properly cast the produtos property to handle the array or single object
          const produto = venda.produtos as any;
          const productId = produto.id;
          const productName = produto.nome;
          
          if (!productSales[productId]) {
            productSales[productId] = {
              id: productId,
              nome: productName,
              total: 0
            };
          }
          
          productSales[productId].total += venda.valor;
        }
      });
      
      // Convert to chart data and sort by total sales
      let chartData: ChartData[] = Object.values(productSales).map(product => ({
        name: product.nome,
        valor: product.total
      }));
      
      // Sort by value (descending)
      chartData.sort((a, b) => b.valor - a.valor);
      
      // Take top 5 products
      chartData = chartData.slice(0, 5);
      
      setTopProductsData(chartData);
      
    } catch (error) {
      console.error('Error fetching top products data:', error);
      setTopProductsData([]);
    }
  };

  // Mock data for PIX and Card Capture charts for now
  const generateMockData = () => {
    const mockPixData: ChartData[] = [];
    const mockCardData: ChartData[] = [];
    
    // Generate some mock data for the last 10 days
    for (let i = 9; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'dd/MM');
      mockPixData.push({
        name: date,
        valor: Math.floor(Math.random() * 50) + 10,
      });
      
      mockCardData.push({
        name: date,
        valor: Math.floor(Math.random() * 30) + 5,
      });
    }
    
    setPixGeneratedData(mockPixData);
    setCardCaptureData(mockCardData);
  };

  // Use Effects to load data
  useEffect(() => {
    fetchDashboardStats();
    generateMockData();
  }, []);

  useEffect(() => {
    const fetchAllChartData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSalesVsCustomersData(),
        fetchTopProductsData(),
        // Add other chart data fetching functions here
      ]);
      setIsLoading(false);
    };

    fetchAllChartData();
  }, [startDate, endDate]);

  return {
    totalClientes,
    produtosAtivos,
    receitaTotal,
    taxaConversao,
    isLoading,
    salesVsCustomersData,
    topProductsData,
    pixGeneratedData,
    cardCaptureData,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  };
}
