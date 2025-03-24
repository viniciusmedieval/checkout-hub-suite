
import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigCheckout } from "@/lib/supabase";

interface AnalyzingPaymentProps {
  configCheckout?: ConfigCheckout | null;
  productName?: string;
  onReturn?: () => void;
}

export function AnalyzingPayment({ configCheckout, productName, onReturn }: AnalyzingPaymentProps) {
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  return (
    <div className="max-w-md w-full mx-auto text-center space-y-6">
      <div className="bg-amber-50 text-amber-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
        <Clock size={40} />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800">Pagamento em Análise</h1>
      
      <p className="text-gray-600">
        Seu pagamento para {productName || "o produto"} está sendo processado e analisado pela operadora do cartão.
        Você receberá uma notificação assim que tivermos uma atualização.
      </p>
      
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm text-amber-700">
          O processamento pode levar até 48 horas, dependendo da sua operadora de cartão.
        </p>
      </div>
      
      {onReturn && (
        <Button 
          onClick={onReturn}
          className="mt-6 gap-2"
          style={{
            backgroundColor: buttonColor,
            color: buttonTextColor
          }}
        >
          Voltar para a loja <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
}
