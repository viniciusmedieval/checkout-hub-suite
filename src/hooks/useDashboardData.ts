
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

// Custom hook for dashboard data
export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    produtosAtivos: 0,
    totalVendas: 0,
    taxaConversao: 0,
    loading: true,
  });

  const [salesVsCustomersData, setSalesVsCustomersData] = useState<ChartData[]>([]);
  const [topProductsData, setTopProductsData] = useState<ChartData[]>([]);
  const [pixGeneratedData, setPixGeneratedData] = useState<ChartData[]>([]);
  const [cardCaptureData, setCardCaptureData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: new Date(),
  });

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
      setStats({
        totalClientes: clientesData.length || 0,
        produtosAtivos: produtosData.length || 0,
        totalVendas: totalVendasValor || 0,
        taxaConversao: parseFloat(conversao.toFixed(2)) || 0,
        loading: false,
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Function to fetch sales vs customers data for the chart
  const fetchSalesVsCustomersData = async () => {
    try {
      // Format the date range for query
      const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
      const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
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
      const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
      const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
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
          const produto = venda.produtos as Produto;
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

  // Use Effects to load data
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchAllChartData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSalesVsCustomersData(),
        fetchTopProductsData(),
        // Add other chart data fetching functions here
      ]);
      setLoading(false);
    };

    fetchAllChartData();
  }, [dateRange]);

  return {
    stats,
    salesVsCustomersData,
    topProductsData,
    pixGeneratedData,
    cardCaptureData,
    loading,
    dateRange,
    setDateRange
  };
}
