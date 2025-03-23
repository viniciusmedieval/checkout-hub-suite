
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
import { ChartData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

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
        <RechartsLineChart data={data} margin={{ right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#888" />
          {/* Left Y-axis for Vendas (Sales) */}
          <YAxis 
            yAxisId="left"
            stroke="#3b82f6" 
            tickFormatter={(value) => formatCurrency(value)}
          />
          {/* Right Y-axis for Clientes (Customers) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#10b981"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
            formatter={(value, name) => {
              if (name === "Vendas") return [formatCurrency(value as number), name];
              return [value, name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="valor" 
            name="Vendas" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
            yAxisId="left"
          />
          <Line 
            type="monotone" 
            dataKey="quantidade" 
            name="Clientes" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
            yAxisId="right"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
