
import { Users, Package, DollarSign, PercentCircle } from "lucide-react";
import { StatCard } from "./StatCard";
import { formatCurrency } from "@/utils/formatters";

interface StatsCardsProps {
  totalClientes: number;
  produtosAtivos: number;
  receitaTotal: number;
  taxaConversao: number;
  isLoading: boolean;
}

export function StatsCards({ 
  totalClientes, 
  produtosAtivos, 
  receitaTotal, 
  taxaConversao, 
  isLoading 
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total de Clientes" 
        value={isLoading ? "..." : totalClientes.toString()} 
        icon={<Users />} 
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard 
        title="Produtos Ativos" 
        value={isLoading ? "..." : produtosAtivos.toString()} 
        icon={<Package />} 
        trend={{ value: 4, isPositive: true }}
      />
      <StatCard 
        title="Receita Total" 
        value={isLoading ? "..." : formatCurrency(receitaTotal)} 
        icon={<DollarSign />} 
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard 
        title="Taxa de Conversão" 
        value={isLoading ? "..." : `${taxaConversao}%`} 
        icon={<PercentCircle />} 
        trend={{ value: 1.2, isPositive: false }}
      />
    </div>
  );
}
