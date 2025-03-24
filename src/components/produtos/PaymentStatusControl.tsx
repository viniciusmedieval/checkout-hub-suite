
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Activity, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { usePaymentStatus, PaymentStatus } from "@/hooks/checkout";
import { toast } from "sonner";

interface PaymentStatusControlProps {
  productSlug: string;
}

export function PaymentStatusControl({ productSlug }: PaymentStatusControlProps) {
  const { simulatePayment } = usePaymentStatus();
  const [open, setOpen] = useState(false);
  const [cardRedirectStatus, setCardRedirectStatus] = useState<PaymentStatus>('approved');
  
  const handleStatusSelect = (status: PaymentStatus) => {
    simulatePayment(status, productSlug);
    toast.success(`Status de pagamento alterado para ${getStatusLabel(status)}`);
    setOpen(false);
  };

  const handleCardRedirectChange = (status: PaymentStatus) => {
    setCardRedirectStatus(status);
    toast.success(`Cartão agora redirecionará para ${getStatusLabel(status)}`);
    
    // Store the preference in local storage
    localStorage.setItem(`card_redirect_${productSlug}`, status);
    setOpen(false);
  };
  
  // Initialize the card redirect status from localStorage if available
  React.useEffect(() => {
    const savedStatus = localStorage.getItem(`card_redirect_${productSlug}`);
    if (savedStatus && ['analyzing', 'approved', 'rejected'].includes(savedStatus)) {
      setCardRedirectStatus(savedStatus as PaymentStatus);
    }
  }, [productSlug]);
  
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
        className="w-64 bg-white border border-gray-200 shadow-lg z-50"
        align="center"
        forceMount
      >
        <DropdownMenuLabel>Simular Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
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
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Redirecionamento do Cartão</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleCardRedirectChange('analyzing')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <CreditCard className="mr-2 h-4 w-4 text-amber-500" />
          <span>Redirecionar para Em Análise</span>
          {cardRedirectStatus === 'analyzing' && (
            <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleCardRedirectChange('approved')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <CreditCard className="mr-2 h-4 w-4 text-green-500" />
          <span>Redirecionar para Aprovado</span>
          {cardRedirectStatus === 'approved' && (
            <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleCardRedirectChange('rejected')}
          className="flex items-center cursor-pointer hover:bg-gray-100 py-2"
        >
          <CreditCard className="mr-2 h-4 w-4 text-red-500" />
          <span>Redirecionar para Recusado</span>
          {cardRedirectStatus === 'rejected' && (
            <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
