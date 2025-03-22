
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  celular: string;
  documento: string;
  produto_id: number;
  produto_nome: string;
  criado_em: string;
}

interface ClientesTableProps {
  clientes: Cliente[];
  formatDate: (dateString: string) => string;
}

export const ClientesTable = ({ clientes, formatDate }: ClientesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Celular</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Data de Cadastro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nome}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.celular}</TableCell>
              <TableCell>{cliente.documento}</TableCell>
              <TableCell>{cliente.produto_nome}</TableCell>
              <TableCell>{formatDate(cliente.criado_em)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhum cliente encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
