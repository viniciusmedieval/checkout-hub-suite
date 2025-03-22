
import { 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart as RechartsLineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesVsCustomersChartProps {
  data: ChartData[];
  isLoading: boolean;
}

export function SalesVsCustomersChart({ data, isLoading }: SalesVsCustomersChartProps) {
  if (isLoading) {
    return (
      <ChartCard title="Vendas vs Clientes" description="Comparativo mensal">
        <Skeleton className="w-full h-[300px]" />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Vendas vs Clientes" description="Comparativo mensal">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="vendas" 
            name="Vendas" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="clientes" 
            name="Clientes" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
