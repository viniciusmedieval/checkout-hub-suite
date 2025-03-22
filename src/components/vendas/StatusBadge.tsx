
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'aprovado':
      return <Badge className="bg-green-600">Aprovado</Badge>;
    case 'pendente':
      return <Badge className="bg-yellow-600">Pendente</Badge>;
    case 'recusado':
      return <Badge variant="destructive">Recusado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
