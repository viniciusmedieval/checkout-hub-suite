
import { format } from 'date-fns';
import { ChartData } from '@/types/dashboard';

// Transform raw data into chart format for Sales vs Customers
export const transformSalesVsCustomersData = (vendasData: any[], clientesData: any[]): ChartData[] => {
  // Group data by date for the chart
  const groupedData: Record<string, { valor: number; quantidade: number }> = {};
  
  // Group sales by date
  vendasData.forEach(venda => {
    const date = format(new Date(venda.criado_em), 'dd/MM');
    if (!groupedData[date]) {
      groupedData[date] = { valor: 0, quantidade: 0 };
    }
    groupedData[date].valor += venda.valor;
  });
  
  // Group customers by date
  clientesData.forEach(cliente => {
    const date = format(new Date(cliente.criado_em), 'dd/MM');
    if (!groupedData[date]) {
      groupedData[date] = { valor: 0, quantidade: 0 };
    }
    groupedData[date].quantidade += 1;
  });
  
  // Convert grouped data to chart format
  const chartData: ChartData[] = Object.keys(groupedData).map(date => ({
    name: date,
    valor: groupedData[date].valor,
    quantidade: groupedData[date].quantidade
  }));
  
  // Sort by date (day/month format)
  chartData.sort((a, b) => {
    const [dayA, monthA] = a.name.split('/').map(Number);
    const [dayB, monthB] = b.name.split('/').map(Number);
    return (monthA - monthB) || (dayA - dayB);
  });
  
  return chartData;
};

// Transform raw data into chart format for Top Products
export const transformTopProductsData = (data: any[]): ChartData[] => {
  // Group sales by product
  const productSales: Record<string, { id: number; nome: string; total: number }> = {};
  
  data.forEach(venda => {
    if (venda.produtos) {
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
  return chartData.slice(0, 5);
};

// Generate mock data for PIX and Card Capture charts
export const generateMockChartData = (days: number): { pixData: ChartData[], cardData: ChartData[] } => {
  const mockPixData: ChartData[] = [];
  const mockCardData: ChartData[] = [];
  
  // Generate some mock data for the last n days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'dd/MM');
    
    mockPixData.push({
      name: dateStr,
      valor: Math.floor(Math.random() * 50) + 10,
    });
    
    mockCardData.push({
      name: dateStr,
      valor: Math.floor(Math.random() * 30) + 5,
    });
  }
  
  return { pixData: mockPixData, cardData: mockCardData };
};
