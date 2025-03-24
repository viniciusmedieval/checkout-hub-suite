
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Activity, CheckCircle, XCircle } from "lucide-react";
import { usePaymentStatus, PaymentStatus } from "@/hooks/checkout";

interface PaymentStatusControlProps {
  productSlug: string;
}

export function PaymentStatusControl({ productSlug }: PaymentStatusControlProps) {
  const { simulatePayment } = usePaymentStatus();
  
  const handleStatusSelect = (status: PaymentStatus) => {
    simulatePayment(status, productSlug);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          Status de Pagamento <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('analyzing')}
          className="flex items-center cursor-pointer"
        >
          <Activity className="mr-2 h-4 w-4 text-amber-500" />
          <span>Em Análise</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('approved')}
          className="flex items-center cursor-pointer"
        >
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          <span>Aprovado</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('rejected')}
          className="flex items-center cursor-pointer"
        >
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          <span>Recusado</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
