
import { Button } from "@/components/ui/button";
import { Produto, ConfigCheckout } from "@/lib/types/database-types";
import { ShoppingBag, Clock, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

interface ResumoCompraProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  visitorCount: number;
  isProcessing?: boolean;
  onCompletePurchase: () => void;
  paymentMethod: 'card' | 'pix';
}

export function ResumoCompra({
  produto,
  configCheckout,
  visitorCount,
  isProcessing = false,
  onCompletePurchase,
  paymentMethod
}: ResumoCompraProps) {
  const navigate = useNavigate();
  
  // Default text color is white, but use configured color if available
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  // Default button color is purple/indigo, but use configured color if available
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  
  // Default text is "Finalizar Compra", but use configured text if available
  const buttonText = configCheckout?.texto_botao || "Finalizar Compra";
  
  // Determine whether to show the visitor counter
  const showCounter = configCheckout?.mostrar_contador !== false;
  
  // Get custom counter text or use default
  const counterText = configCheckout?.texto_contador || "Apenas {count} pessoas podem acessar esta oferta hoje";
  
  // Get custom counter text color or use default
  const counterTextColor = configCheckout?.cor_texto_contador || "#ef4444";
  
  // Format the visitor counter text, replacing the {count} placeholder with the actual count
  const getCounterText = () => {
    if (!showCounter) return "";
    return counterText.replace("{count}", visitorCount.toString());
  };
  
  // Handle checkout button click
  const handleCheckoutButton = () => {
    if (paymentMethod === 'pix') {
      console.log("🔍 Redirecting to PIX payment page:", `/pix-payment/${produto.slug}`);
      navigate(`/pix-payment/${produto.slug}`);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gray-600" />
            <span className="font-medium text-gray-700">Resumo da compra</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(produto.valor)}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-gray-600">Total</span>
          <span className="text-xl font-bold text-green-600">{formatCurrency(produto.valor)}</span>
        </div>
        
        {/* Mostrar o botão apenas para pagamentos PIX */}
        {paymentMethod === 'pix' && (
          <Button
            onClick={handleCheckoutButton}
            disabled={isProcessing}
            className="w-full mt-4 gap-2"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor
            }}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                {buttonText}
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Only show these indicators if we should show the counter */}
      {showCounter && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-amber-500" />
            <span className="text-gray-600">Oferta por tempo limitado</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-red-500" />
            <span style={{ color: counterTextColor }}>{getCounterText()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
