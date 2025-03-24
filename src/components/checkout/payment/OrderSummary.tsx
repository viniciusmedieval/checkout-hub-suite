
import { ShoppingCart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { Produto } from "@/lib/types/database-types";
import { useState } from "react";
import { toast } from "sonner";
import { ConfigCheckout } from "@/lib/supabase";

interface OrderSummaryProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function OrderSummary({ produto, configCheckout }: OrderSummaryProps) {
  const [loading, setLoading] = useState(false);
  
  // Obter a cor do botão e texto das configurações ou usar o padrão
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  const buttonText = configCheckout?.texto_botao || "GARANTIR AGORA";
  
  // Para debugging
  console.log("OrderSummary - Cor do botão:", buttonColor);
  console.log("OrderSummary - Cor do texto do botão:", buttonTextColor);
  console.log("OrderSummary - Texto do botão:", buttonText);
  
  const handleComprar = async () => {
    setLoading(true);

    setTimeout(() => {
      toast.success("Sua compra foi processada com sucesso!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <ShoppingCart size={16} className="text-blue-600" />
        </div>
        <h3 className="checkout-heading">Resumo da Compra</h3>
      </div>
      
      <div className="border border-gray-100 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
            <img 
              src={produto.imagem_url || 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto'} 
              alt={produto.nome} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto';
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Produto Digital</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-medium text-gray-800">{produto.nome}</p>
                {produto.descricao && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{produto.descricao}</p>
                )}
              </div>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(produto.valor)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleComprar}
        className="w-full font-bold py-4 text-base h-auto"
        disabled={loading}
        style={{ 
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </>
        ) : (
          buttonText
        )}
      </Button>
      
      {/* Only show security message if it's not already displayed in the footer */}
      {configCheckout?.mensagem_rodape && (
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500 gap-1.5">
          <Shield size={14} />
          <span>{configCheckout.mensagem_rodape}</span>
        </div>
      )}
      
      {/* Display terms message if available */}
      {configCheckout?.mensagem_termos && configCheckout.mensagem_termos.trim() !== "" && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          <p>{configCheckout.mensagem_termos}</p>
        </div>
      )}
    </div>
  );
}
