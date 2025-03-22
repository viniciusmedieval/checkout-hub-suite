
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SalesVsCustomersChart } from "@/components/dashboard/SalesVsCustomersChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { CardCaptureChart } from "@/components/dashboard/CardCaptureChart";
import { PixGeneratedChart } from "@/components/dashboard/PixGeneratedChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DateRange } from "@/components/dashboard/DateRange";

const Dashboard = () => {
  const { 
    totalClientes, 
    produtosAtivos, 
    receitaTotal, 
    taxaConversao, 
    isLoading,
    salesVsCustomersData,
    topProductsData,
    cardCaptureData,
    pixGeneratedData,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  } = useDashboardData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DateRange 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      
      <StatsCards 
        totalClientes={totalClientes}
        produtosAtivos={produtosAtivos}
        receitaTotal={receitaTotal}
        taxaConversao={taxaConversao}
        isLoading={isLoading}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SalesVsCustomersChart data={salesVsCustomersData} isLoading={isLoading} />
        <TopProductsChart data={topProductsData} isLoading={isLoading} />
        <CardCaptureChart data={cardCaptureData} isLoading={isLoading} />
        <PixGeneratedChart data={pixGeneratedData} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
