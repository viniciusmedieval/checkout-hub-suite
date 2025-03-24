
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { PaymentMethodIcon } from "./PaymentMethodIcon";
import { Skeleton } from "@/components/ui/skeleton";

interface Venda {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  produto_id: number;
  produto_nome: string;
  valor: number;
  status: string;
  metodo_pagamento: string;
  criado_em: string;
}

interface VendasTableProps {
  vendas: Venda[];
  formatDate: (dateString: string) => string;
  isLoading?: boolean;
}

export const VendasTable = ({ vendas, formatDate, isLoading = false }: VendasTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendas.length > 0 ? (
          vendas.map((venda) => (
            <TableRow key={venda.id}>
              <TableCell className="font-medium">{venda.cliente_nome}</TableCell>
              <TableCell>{venda.produto_nome}</TableCell>
              <TableCell>R$ {venda.valor.toFixed(2)}</TableCell>
              <TableCell><StatusBadge status={venda.status} /></TableCell>
              <TableCell><PaymentMethodIcon method={venda.metodo_pagamento} /></TableCell>
              <TableCell>{formatDate(venda.criado_em)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhuma venda encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
