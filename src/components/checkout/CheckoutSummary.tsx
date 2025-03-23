
import { Produto, ConfigCheckout } from "@/lib/supabase";

interface CheckoutSummaryProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutSummary({ produto, configCheckout }: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
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
            <h3 className="font-medium">{produto.nome}</h3>
            <p className="text-sm text-gray-500">{produto.tipo}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>R$ {Number(produto.valor).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>R$ {Number(produto.valor).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          {configCheckout?.texto_botao || "FINALIZAR COMPRA"}
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          Ao finalizar sua compra, você concorda com nossos termos de serviço.
        </p>
      </div>
    </div>
  );
}
