
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
import { ChartData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface CardCaptureChartProps {
  data: ChartData[];
  isLoading: boolean;
}

export function CardCaptureChart({ data, isLoading }: CardCaptureChartProps) {
  if (isLoading) {
    return (
      <ChartCard title="Cartões Capturados" description="Evolução mensal">
        <Skeleton className="w-full h-[300px]" />
      </ChartCard>
    );
  }

  // If no data is available
  if (data.length === 0) {
    return (
      <ChartCard title="Cartões Capturados" description="Evolução mensal">
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Nenhum dado disponível para o período selecionado
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Cartões Capturados" description="Evolução mensal">
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
            formatter={(value) => [`${value} cartões`, 'Quantidade']}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="valor" 
            name="Cartões" 
            stroke="#f97316" 
            fill="rgba(249, 115, 22, 0.2)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

