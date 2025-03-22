
import { 
  AreaChart, 
  CartesianGrid,
  Area, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

interface PixGeneratedChartProps {
  data: ChartData[];
  isLoading: boolean;
}

export function PixGeneratedChart({ data, isLoading }: PixGeneratedChartProps) {
  if (isLoading) {
    return (
      <ChartCard title="PIX Gerados" description="Evolução mensal">
        <Skeleton className="w-full h-[300px]" />
      </ChartCard>
    );
  }

  // If no data is available
  if (data.length === 0) {
    return (
      <ChartCard title="PIX Gerados" description="Evolução mensal">
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Nenhum dado disponível para o período selecionado
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="PIX Gerados" description="Evolução mensal">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 15, 15, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          />
          <Area 
            type="monotone" 
            dataKey="pix" 
            name="PIX" 
            stroke="#8b5cf6" 
            fill="rgba(139, 92, 246, 0.2)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
