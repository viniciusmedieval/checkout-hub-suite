
import React from "react";
import { XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigCheckout } from "@/lib/supabase";

interface RejectedPaymentProps {
  configCheckout?: ConfigCheckout | null;
  productName?: string;
  errorMessage?: string;
  onTryAgain?: () => void;
  onReturn?: () => void;
}

export function RejectedPayment({ 
  configCheckout, 
  productName, 
  errorMessage, 
  onTryAgain, 
  onReturn 
}: RejectedPaymentProps) {
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  return (
    <div className="max-w-md w-full mx-auto text-center space-y-6">
      <div className="bg-red-50 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <XCircle size={40} />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800">Pagamento Recusado</h1>
      
      <p className="text-gray-600">
        Infelizmente, seu pagamento para {productName || "o produto"} foi recusado pela operadora do cartão.
      </p>
      
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <p className="text-sm text-red-700">
          {errorMessage || "Motivo: A operadora do cartão recusou a transação. Por favor, verifique os dados do cartão ou tente utilizar outro método de pagamento."}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onTryAgain && (
          <Button
            onClick={onTryAgain}
            className="gap-2"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor
            }}
          >
            <RefreshCw size={16} /> Tentar novamente
          </Button>
        )}
        
        {onReturn && (
          <Button 
            onClick={onReturn}
            variant="outline"
            className="gap-2"
          >
            Voltar para a loja <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
