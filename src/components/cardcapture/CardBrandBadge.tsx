
import { Badge } from "@/components/ui/badge";

interface CardBrandBadgeProps {
  bandeira: string;
}

export const CardBrandBadge = ({ bandeira }: CardBrandBadgeProps) => {
  switch (bandeira.toLowerCase()) {
    case 'visa':
      return <Badge className="bg-blue-600">VISA</Badge>;
    case 'mastercard':
      return <Badge className="bg-red-600">Mastercard</Badge>;
    case 'amex':
      return <Badge className="bg-green-600">Amex</Badge>;
    default:
      return <Badge>{bandeira}</Badge>;
  }
};
