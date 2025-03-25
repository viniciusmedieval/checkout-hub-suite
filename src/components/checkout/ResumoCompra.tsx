
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { ShoppingCart, Shield, Users } from "lucide-react";
import { Produto, ConfigCheckout } from "@/lib/types/database-types";
import { useNavigate } from "react-router-dom";

interface ResumoCompraProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  visitorCount: number;
  isProcessing?: boolean;
  onCompletePurchase: () => void;
  paymentMethod?: 'card' | 'pix';
}

export function ResumoCompra({ 
  produto, 
  configCheckout, 
  visitorCount,
  isProcessing = false,
  onCompletePurchase,
  paymentMethod = 'card'
}: ResumoCompraProps) {
  const navigate = useNavigate();
  
  // Get customized colors from configurations
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  // Get button text based on payment method and configurations
  let buttonText = "";
  if (paymentMethod === 'card') {
    buttonText = configCheckout?.texto_botao || produto.checkout_button_text || "PAGAR COM CARTÃO";
  } else {
    buttonText = "PAGAR COM PIX";
  }
  
  const counterTextColor = configCheckout?.cor_texto_contador || "#4B5563";
  
  // For debugging
  console.log("ResumoCompra - Config:", { 
    produto_button_text: produto.checkout_button_text, 
    config_button_text: configCheckout?.texto_botao,
    buttonColor, 
    buttonTextColor, 
    counterTextColor,
    paymentMethod
  });

  // Process visitor counter text with the count placeholder
  const getVisitorCountText = () => {
    if (!configCheckout?.mostrar_contador) return null;
    
    const text = configCheckout.texto_contador || "{count} pessoas estão vendo este produto agora";
    return text.replace("{count}", visitorCount.toString());
  };
  
  // Handle checkout button click - for both PIX and card payments
  const handleCheckoutButton = () => {
    if (paymentMethod === 'pix') {
      console.log("Redirecting to PIX payment page:", `/pix-payment/${produto.slug}`);
      navigate(`/pix-payment/${produto.slug}`);
    } else {
      // For card payments, we call the onCompletePurchase function
      // which will handle the payment processing and redirection
      console.log("Calling onCompletePurchase function for card payment");
      onCompletePurchase();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          <ShoppingCart size={16} className="text-blue-600" />
        </div>
        <h3 className="font-medium text-gray-800">Resumo da Compra</h3>
      </div>
      
      <div className="flex items-start gap-3 border border-gray-100 rounded-lg p-3">
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
      
      {/* Visitor counter - only show if enabled in config */}
      {configCheckout?.mostrar_contador && visitorCount > 0 && (
        <div className="flex items-center justify-center gap-2" style={{ color: counterTextColor }}>
          <Users size={16} />
          <span className="text-sm">{getVisitorCountText()}</span>
        </div>
      )}
      
      <Button 
        onClick={handleCheckoutButton}
        className="w-full font-bold py-4 text-base h-auto"
        disabled={isProcessing}
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
          buttonText
        )}
      </Button>
      
      {/* Security message */}
      {configCheckout?.mensagem_rodape && configCheckout.mensagem_rodape.trim() !== "" && (
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500 gap-1.5">
          <Shield size={14} />
          <span>{configCheckout.mensagem_rodape}</span>
        </div>
      )}
      
      {/* Terms message */}
      {configCheckout?.mensagem_termos && configCheckout.mensagem_termos.trim() !== "" && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          <p>{configCheckout.mensagem_termos}</p>
        </div>
      )}
    </div>
  );
}
