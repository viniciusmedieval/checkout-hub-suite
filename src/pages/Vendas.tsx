
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VendasFilter } from "@/components/vendas/VendasFilter";
import { VendasTable } from "@/components/vendas/VendasTable";
import { useVendas } from "@/hooks/useVendas";
import { formatDate } from "@/lib/format";

const Vendas = () => {
  const { vendas, searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useVendas();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
      </div>

      <VendasFilter 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        setSearchTerm={setSearchTerm}
        setStatusFilter={setStatusFilter}
      />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Todas as transações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendasTable vendas={vendas} formatDate={formatDate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendas;
