
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

const pixGeneratedData = [
  { name: "Jan", pix: 40 },
  { name: "Fev", pix: 30 },
  { name: "Mar", pix: 20 },
  { name: "Abr", pix: 27 },
  { name: "Mai", pix: 18 },
  { name: "Jun", pix: 23 },
  { name: "Jul", pix: 34 },
];

export function PixGeneratedChart() {
  return (
    <ChartCard title="PIX Gerados" description="Evolução mensal">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={pixGeneratedData}>
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
