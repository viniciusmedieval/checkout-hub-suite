
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface CardBrandBadgeProps {
  bandeira: string;
}

export const CardBrandBadge = ({ bandeira }: CardBrandBadgeProps) => {
  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return "bg-blue-600";
      case 'mastercard':
        return "bg-red-600";
      case 'amex':
        return "bg-green-600";
      case 'discover':
        return "bg-orange-600";
      case 'diners':
        return "bg-purple-600";
      case 'jcb':
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getCardBrandIcon = () => {
    return <CreditCard className="h-3 w-3 mr-1" />;
  };

  return (
    <Badge className={`${getCardBrandColor(bandeira)} flex items-center`}>
      {getCardBrandIcon()}
      {bandeira.toUpperCase()}
    </Badge>
  );
};
