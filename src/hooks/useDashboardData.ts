
import { useState, useEffect } from 'react';
import { startOfMonth, subMonths } from 'date-fns';
import { ChartData } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { 
  fetchTotalClients, 
  fetchActiveProducts, 
  fetchTotalSales,
  fetchSalesVsCustomersData,
  fetchTopProductsData
} from '@/services/dashboardService';
import { 
  transformSalesVsCustomersData, 
  transformTopProductsData,
  generateMockChartData
} from '@/utils/chartDataTransformers';

// Export formatCurrency for backward compatibility
export { formatCurrency };

// Export types from the types file for backward compatibility
export type { ChartData, DashboardStats, DateRange } from '@/types/dashboard';

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
      const [clientsCount, activeProductsCount, totalSalesAmount] = await Promise.all([
        fetchTotalClients(),
        fetchActiveProducts(),
        fetchTotalSales()
      ]);
      
      // Calculate conversion rate (assuming it's sales / clients)
      const conversao = clientsCount > 0 
        ? (totalSalesAmount / clientsCount) * 100 
        : 0;
      
      // Update stats state
      setTotalClientes(clientsCount);
      setProdutosAtivos(activeProductsCount);
      setReceitaTotal(totalSalesAmount);
      setTaxaConversao(parseFloat(conversao.toFixed(2)) || 0);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setIsLoading(false);
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      // Fetch sales vs customers data
      const { vendasData, clientesData } = await fetchSalesVsCustomersData(startDate, endDate);
      const chartData = transformSalesVsCustomersData(vendasData, clientesData);
      setSalesVsCustomersData(chartData);
      
      // Fetch top products data
      const topProductsRawData = await fetchTopProductsData(startDate, endDate);
      const topProductsChartData = transformTopProductsData(topProductsRawData);
      setTopProductsData(topProductsChartData);
      
      // Generate mock data for PIX and Card charts
      const { pixData, cardData } = generateMockChartData(10);
      setPixGeneratedData(pixData);
      setCardCaptureData(cardData);
      
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // Use Effects to load data
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchAllChartData = async () => {
      setIsLoading(true);
      await fetchChartData();
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
