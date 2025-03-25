
import React from "react";
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/types/database-types";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";

interface PixPaymentFooterProps {
  configCheckout?: ConfigCheckout | null;
  securityMessage: string;
}

export function PixPaymentFooter({ configCheckout, securityMessage }: PixPaymentFooterProps) {
  return (
    <>
      <div className="flex items-center justify-center text-sm text-gray-600 gap-1.5">
        <Shield size={14} className="text-green-600" />
        <p>{securityMessage}</p>
      </div>
      
      <CheckoutFooter configCheckout={configCheckout} />
    </>
  );
}
