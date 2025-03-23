
import { 
  BarChart, 
  CartesianGrid, 
  Bar, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface TopProductsChartProps {
  data: ChartData[];
  isLoading: boolean;
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  if (isLoading) {
    return (
      <ChartCard title="Produtos Mais Vendidos" description="Top produtos por receita">
        <Skeleton className="w-full h-[300px]" />
      </ChartCard>
    );
  }

  // If no data is available
  if (data.length === 0) {
    return (
      <ChartCard title="Produtos Mais Vendidos" description="Top produtos por receita">
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Nenhum dado disponível para o período selecionado
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Produtos Mais Vendidos" description="Top produtos por receita">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          />
          <Bar dataKey="valor" name="Valor (R$)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
