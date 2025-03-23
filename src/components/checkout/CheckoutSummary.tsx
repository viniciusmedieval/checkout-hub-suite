
import { useState } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { LockIcon } from "lucide-react";

interface CheckoutSummaryProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutSummary({ produto, configCheckout }: CheckoutSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Obter a cor do botão e do texto do botão das configurações ou usar o padrão
  const buttonColor = configCheckout?.cor_botao || "#1E88E5";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  const handleCompletePurchase = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Redirecionando para o pagamento...");
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-800">Pagamento</h2>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          {produto.imagem_url && (
            <img 
              src={produto.imagem_url} 
              alt={produto.nome} 
              className="w-12 h-12 object-cover rounded border border-gray-200"
            />
          )}
          <div>
            <h3 className="font-medium text-sm text-gray-800">{produto.nome}</h3>
            <p className="text-xs text-gray-500">{produto.tipo}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-800">Total</span>
          <span className="text-base font-bold text-gray-800">R$ {Number(produto.valor).toFixed(2)}</span>
        </div>
        
        <button 
          className="w-full py-2.5 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
          onClick={handleCompletePurchase}
          disabled={isProcessing}
          style={{ 
            backgroundColor: buttonColor,
            color: buttonTextColor 
          }}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              <LockIcon size={14} />
              {configCheckout?.texto_botao || "FINALIZAR COMPRA"}
            </>
          )}
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          Pagamento 100% seguro
        </p>
      </div>
    </div>
  );
}
