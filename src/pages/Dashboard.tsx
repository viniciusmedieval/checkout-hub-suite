
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SalesVsCustomersChart } from "@/components/dashboard/SalesVsCustomersChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { CardCaptureChart } from "@/components/dashboard/CardCaptureChart";
import { PixGeneratedChart } from "@/components/dashboard/PixGeneratedChart";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { 
    totalClientes, 
    produtosAtivos, 
    receitaTotal, 
    taxaConversao, 
    isLoading 
  } = useDashboardData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <StatsCards 
        totalClientes={totalClientes}
        produtosAtivos={produtosAtivos}
        receitaTotal={receitaTotal}
        taxaConversao={taxaConversao}
        isLoading={isLoading}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SalesVsCustomersChart />
        <TopProductsChart />
        <CardCaptureChart />
        <PixGeneratedChart />
      </div>
    </div>
  );
};

export default Dashboard;
