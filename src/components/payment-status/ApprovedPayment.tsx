
import React from "react";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigCheckout } from "@/lib/supabase";

interface ApprovedPaymentProps {
  configCheckout?: ConfigCheckout | null;
  productName?: string;
  orderNumber?: string;
  onReturn?: () => void;
}

export function ApprovedPayment({ configCheckout, productName, orderNumber, onReturn }: ApprovedPaymentProps) {
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  return (
    <div className="max-w-md w-full mx-auto text-center space-y-6">
      <div className="bg-green-50 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={40} />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800">Pagamento Aprovado</h1>
      
      <p className="text-gray-600">
        Seu pagamento para {productName || "o produto"} foi aprovado com sucesso.
        {orderNumber && <span className="block mt-2">Número do pedido: <strong>{orderNumber}</strong></span>}
      </p>
      
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-sm text-green-700">
          Enviamos um e-mail com os detalhes da sua compra. Obrigado pela confiança!
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          className="gap-2"
        >
          <Download size={16} /> Baixar recibo
        </Button>
        
        {onReturn && (
          <Button 
            onClick={onReturn}
            className="gap-2"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor
            }}
          >
            Voltar para a loja <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
