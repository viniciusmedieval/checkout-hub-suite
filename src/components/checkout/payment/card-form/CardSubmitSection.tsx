
import { CardFormButton } from "@/components/checkout/payment/CardFormButton";
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/types/database-types";

interface CardSubmitSectionProps {
  formIsComplete: boolean;
  isProcessing: boolean;
  handleSubmit: () => void;
  securityMessage?: string;
  configCheckout?: ConfigCheckout | null;
}

export function CardSubmitSection({ 
  formIsComplete, 
  isProcessing, 
  handleSubmit,
  securityMessage,
  configCheckout
}: CardSubmitSectionProps) {
  // Get custom color and text from config or use default
  const buttonColor = configCheckout?.cor_botao_card || configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao_card || configCheckout?.cor_texto_botao || "#FFFFFF";
  const buttonText = configCheckout?.texto_botao_card || "Pagar com Cartão";

  return (
    <div className="space-y-4">
      <CardFormButton 
        formIsComplete={formIsComplete}
        isSubmitting={isProcessing}
        onClick={handleSubmit}
        buttonColor={buttonColor}
        buttonTextColor={buttonTextColor}
        buttonText={buttonText}
      />
      
      {securityMessage && (
        <div className="flex items-center justify-center text-xs text-gray-500 gap-1.5">
          <Shield size={14} />
          <span>{securityMessage}</span>
        </div>
      )}
    </div>
  );
}
