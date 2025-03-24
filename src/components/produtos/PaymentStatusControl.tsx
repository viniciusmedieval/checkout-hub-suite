
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Activity, CheckCircle, XCircle } from "lucide-react";
import { usePaymentStatus, PaymentStatus } from "@/hooks/checkout";
import { toast } from "sonner";

interface PaymentStatusControlProps {
  productSlug: string;
}

export function PaymentStatusControl({ productSlug }: PaymentStatusControlProps) {
  const { simulatePayment } = usePaymentStatus();
  const [open, setOpen] = useState(false);
  
  const handleStatusSelect = (status: PaymentStatus) => {
    simulatePayment(status, productSlug);
    toast.success(`Status de pagamento alterado para ${getStatusLabel(status)}`);
    setOpen(false);
  };
  
  const getStatusLabel = (status: PaymentStatus): string => {
    switch(status) {
      case 'analyzing': return 'Em Análise';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full bg-white hover:bg-gray-100 flex justify-between items-center">
          <span>Status de Pagamento</span> <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white border border-gray-200 shadow-lg z-[100]"
        align="center"
        forceMount
      >
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('analyzing')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <Activity className="mr-2 h-4 w-4 text-amber-500" />
          <span>Em Análise</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('approved')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          <span>Aprovado</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusSelect('rejected')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          <span>Recusado</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
