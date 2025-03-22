
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

const topProductsData = [
  { name: "Produto A", valor: 4000 },
  { name: "Produto B", valor: 3000 },
  { name: "Produto C", valor: 2000 },
  { name: "Produto D", valor: 2780 },
  { name: "Produto E", valor: 1890 },
];

export function TopProductsChart() {
  return (
    <ChartCard title="Produtos Mais Vendidos" description="Top produtos por receita">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProductsData}>
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
