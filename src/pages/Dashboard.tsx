
import { Users, Package, DollarSign, PercentCircle, LineChart, BarChart3, CreditCard, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const topProductsData = [
  { name: "Produto A", valor: 4000 },
  { name: "Produto B", valor: 3000 },
  { name: "Produto C", valor: 2000 },
  { name: "Produto D", valor: 2780 },
  { name: "Produto E", valor: 1890 },
];

const cardCaptureData = [
  { name: "Jan", cartoes: 4 },
  { name: "Fev", cartoes: 3 },
  { name: "Mar", cartoes: 2 },
  { name: "Abr", cartoes: 7 },
  { name: "Mai", cartoes: 8 },
  { name: "Jun", cartoes: 5 },
  { name: "Jul", cartoes: 9 },
];

const pixGeneratedData = [
  { name: "Jan", pix: 40 },
  { name: "Fev", pix: 30 },
  { name: "Mar", pix: 20 },
  { name: "Abr", pix: 27 },
  { name: "Mai", pix: 18 },
  { name: "Jun", pix: 23 },
  { name: "Jul", pix: 34 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Clientes" 
          value="2,543" 
          icon={<Users />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Produtos Ativos" 
          value="12" 
          icon={<Package />} 
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard 
          title="Receita Total" 
          value="R$ 154.234,00" 
          icon={<DollarSign />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="5.2%" 
          icon={<PercentCircle />} 
          trend={{ value: 1.2, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Vendas vs Clientes" description="Comparativo mensal">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesVsCustomersData}>
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
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

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
      </div>
    </div>
  );
};

export default Dashboard;
