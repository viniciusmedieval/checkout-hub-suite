
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { LockIcon, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ResumoCompraProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  visitorCount: number;
  isProcessing: boolean;
  onCompletePurchase: () => void;
}

export function ResumoCompra({ 
  produto, 
  configCheckout,
  visitorCount,
  isProcessing, 
  onCompletePurchase 
}: ResumoCompraProps) {
  // Obter a cor do botão e do texto do botão das configurações ou usar o padrão
  const buttonColor = configCheckout?.cor_botao || "#00C853"; // Verde por padrão 
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3 mb-1">
          <span className="text-sm font-medium">Sua Compra</span>
          <span className="text-sm">1 item</span>
        </div>
        
        <div className="flex items-center gap-3">
          {produto.imagem_url && (
            <img 
              src={produto.imagem_url} 
              alt={produto.nome} 
              className="w-16 h-16 object-cover rounded border border-gray-200"
            />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium">{produto.nome}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">{produto.tipo}</p>
              <span className="text-base font-bold">{formatCurrency(Number(produto.valor))}</span>
            </div>
          </div>
        </div>
        
        <button 
          className="w-full py-3.5 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          onClick={onCompletePurchase}
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
              <LockIcon size={16} />
              {configCheckout?.texto_botao || "ASSINAR AGORA"}
            </>
          )}
        </button>
        
        {/* Visitor counter - now moved to the top of the page */}
      </div>
    </div>
  );
}
