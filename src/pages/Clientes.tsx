
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientesFilter } from "@/components/clientes/ClientesFilter";
import { ClientesTable } from "@/components/clientes/ClientesTable";
import { useClientes } from "@/hooks/useClientes";
import { formatDate } from "@/lib/format";

const Clientes = () => {
  const { filteredClientes, searchTerm, setSearchTerm, isLoading } = useClientes();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <ClientesFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientesTable 
            clientes={filteredClientes} 
            formatDate={formatDate} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
