
import React from "react";
import { AnalyzingPayment } from "./AnalyzingPayment";
import { ApprovedPayment } from "./ApprovedPayment";
import { RejectedPayment } from "./RejectedPayment";
import { ConfigCheckout } from "@/lib/supabase";
import { PaymentStatus } from "@/hooks/checkout";

interface PaymentStatusContentProps {
  status: PaymentStatus;
  configCheckout?: ConfigCheckout | null;
  productName?: string;
  orderNumber?: string;
  errorMessage?: string;
  onTryAgain?: () => void;
  onReturn?: () => void;
}

export function PaymentStatusContent({
  status,
  configCheckout,
  productName,
  orderNumber,
  errorMessage,
  onTryAgain,
  onReturn
}: PaymentStatusContentProps) {
  
  // Escolher o componente correto de acordo com o status
  switch (status) {
    case 'analyzing':
      return (
        <AnalyzingPayment 
          configCheckout={configCheckout}
          productName={productName}
          onReturn={onReturn}
        />
      );
      
    case 'approved':
      return (
        <ApprovedPayment 
          configCheckout={configCheckout}
          productName={productName}
          orderNumber={orderNumber}
          onReturn={onReturn}
        />
      );
      
    case 'rejected':
      return (
        <RejectedPayment 
          configCheckout={configCheckout}
          productName={productName}
          errorMessage={errorMessage}
          onTryAgain={onTryAgain}
          onReturn={onReturn}
        />
      );
      
    default:
      return (
        <AnalyzingPayment 
          configCheckout={configCheckout}
          productName={productName}
          onReturn={onReturn}
        />
      );
  }
}
