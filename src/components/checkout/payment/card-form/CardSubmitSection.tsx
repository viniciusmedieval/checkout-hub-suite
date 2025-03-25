
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/types/database-types";

interface CardSubmitSectionProps {
  formIsComplete: boolean;
  isProcessing: boolean;  // This property was previously causing the error
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
      <Button 
        type="button"
        disabled={!formIsComplete || isProcessing}
        onClick={handleSubmit}
        className="w-full py-6 text-base font-semibold relative"
        style={{ 
          backgroundColor: buttonColor,
          color: buttonTextColor,
          opacity: (!formIsComplete || isProcessing) ? 0.7 : 1
        }}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </span>
        ) : buttonText}
      </Button>
      
      {securityMessage && (
        <div className="flex items-center justify-center text-xs text-gray-500 gap-1.5">
          <Shield size={14} />
          <span>{securityMessage}</span>
        </div>
      )}
    </div>
  );
}
