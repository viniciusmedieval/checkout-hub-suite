
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

// Mock data for charts
const salesVsCustomersData = [
  { name: "Jan", clientes: 40, vendas: 24 },
  { name: "Fev", clientes: 30, vendas: 13 },
  { name: "Mar", clientes: 20, vendas: 18 },
  { name: "Abr", clientes: 27, vendas: 24 },
  { name: "Mai", clientes: 18, vendas: 12 },
  { name: "Jun", clientes: 23, vendas: 19 },
  { name: "Jul", clientes: 34, vendas: 29 },
];

export function SalesVsCustomersChart() {
  return (
    <ChartCard title="Vendas vs Clientes" description="Comparativo mensal">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={salesVsCustomersData}>
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
