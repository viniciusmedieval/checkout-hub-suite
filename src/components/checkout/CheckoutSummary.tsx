
import { useState } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";

interface CheckoutSummaryProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutSummary({ produto, configCheckout }: CheckoutSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-black">Resumo do Pedido</h2>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          {produto.imagem_url && (
            <img 
              src={produto.imagem_url} 
              alt={produto.nome} 
              className="w-16 h-16 object-cover rounded-md border border-gray-200"
            />
          )}
          <div>
            <h3 className="font-medium text-black">{produto.nome}</h3>
            <p className="text-sm text-gray-500">{produto.tipo}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-black">R$ {Number(produto.valor).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-medium text-lg">
            <span className="text-black">Total</span>
            <span className="text-black">R$ {Number(produto.valor).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleCompletePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            configCheckout?.texto_botao || "FINALIZAR COMPRA"
          )}
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          Ao finalizar sua compra, você concorda com nossos termos de serviço.
        </p>
      </div>
    </div>
  );
}
