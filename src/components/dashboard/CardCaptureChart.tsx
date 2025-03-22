
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

const cardCaptureData = [
  { name: "Jan", cartoes: 4 },
  { name: "Fev", cartoes: 3 },
  { name: "Mar", cartoes: 2 },
  { name: "Abr", cartoes: 7 },
  { name: "Mai", cartoes: 8 },
  { name: "Jun", cartoes: 5 },
  { name: "Jul", cartoes: 9 },
];

export function CardCaptureChart() {
  return (
    <ChartCard title="Cartões Capturados" description="Evolução mensal">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={cardCaptureData}>
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
            dataKey="cartoes" 
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
