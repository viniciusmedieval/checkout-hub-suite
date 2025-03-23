
import { useState } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { PaymentMethodSelector } from "@/components/checkout/payment/PaymentMethodSelector";
import { Shield, Users } from "lucide-react";

interface CheckoutContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutContent({ produto, configCheckout }: CheckoutContentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  // Get title color from config, fallback to black if not set
  const titleColor = configCheckout?.cor_titulo || "#000000";
  
  // Pix configuration for the product
  const pixConfig = produto ? {
    tipo_chave_pix: produto.tipo_chave_pix,
    chave_pix: produto.chave_pix,
    nome_beneficiario: produto.nome_beneficiario
  } : null;
  
  // Random number for visitor count (for demo purposes)
  const visitorCount = Math.floor(Math.random() * 20000) + 10000;

  return (
    <div className="w-full max-w-md mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <div className="space-y-4">
        {/* Product Title with configurable color */}
        <h1 
          className="text-xl font-bold text-center mb-2"
          style={{ color: titleColor }}
        >
          {produto.checkout_title || produto.nome}
        </h1>
        
        {/* Visitors Counter */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
          <Users size={14} />
          <span>Outras <strong>{visitorCount.toLocaleString()}</strong> pessoas estão finalizando agora</span>
        </div>
        
        {/* Cliente Identification Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <CheckoutForm configCheckout={configCheckout} />
        </div>
        
        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="font-medium text-base mb-4">Pagamento</h2>
          <PaymentMethodSelector 
            productValue={produto.valor} 
            pixConfig={pixConfig}
            onPaymentMethodChange={setPaymentMethod}
            produto={produto}
          />
        </div>
        
        {/* Testimonials Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <CheckoutTestimonials produto_id={produto.id} />
        </div>
        
        {/* Order Summary & CTA Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <CheckoutSummary 
            produto={produto} 
            configCheckout={configCheckout} 
          />
        </div>

        {/* Security Badge */}
        <div className="text-center">
          <p className="text-xs flex items-center justify-center gap-1.5 text-gray-500">
            <Shield size={12} />
            <span>Pagamento 100% seguro</span>
          </p>
        </div>
      </div>
    </div>
  );
}
