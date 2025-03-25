
import React from "react";
import { Produto, ConfigCheckout } from "@/lib/types/database-types";
import { formatCurrency } from "@/utils/formatters";

interface PixPaymentHeaderProps {
  pixTitle: string;
  beneficiaryName: string;
  pixSubtitle: string;
  secondaryColor: string;
  primaryColor: string;
}

export function PixPaymentHeader({
  pixTitle,
  beneficiaryName,
  pixSubtitle,
  secondaryColor,
  primaryColor
}: PixPaymentHeaderProps) {
  return (
    <>
      <div 
        className="p-4 text-center" 
        style={{ backgroundColor: secondaryColor, color: primaryColor }}
      >
        <h1 className="text-xl font-semibold">{pixTitle}</h1>
        <p className="text-sm mt-1">{beneficiaryName}</p>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4 text-center">{pixSubtitle}</p>
      </div>
    </>
  );
}
