
import React from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";
import { PixPaymentHeader } from "@/components/pix-payment/PixPaymentHeader";
import { PixQRCodeSection } from "@/components/pix-payment/PixQRCodeSection";
import { PixInstructions } from "@/components/pix-payment/PixInstructions";
import { OrderSummaryCard } from "@/components/pix-payment/OrderSummaryCard";
import { PixPaymentFooter } from "@/components/pix-payment/PixPaymentFooter";
import { usePixPayment } from "@/hooks/pix-payment/usePixPayment";
import { Produto, ConfigCheckout } from "@/lib/types/database-types";

const PixPaymentPage = () => {
  const {
    produto,
    configCheckout,
    loading,
    error,
    countdown,
    qrCodeUrl,
    pixKey,
    beneficiaryName,
    pixTitle,
    pixSubtitle,
    pixInstructions,
    pixSecurityMessage,
    primaryColor,
    secondaryColor,
    backgroundColor,
    formatTime,
    handleConfirmPayment,
    handleBackToCheckout
  } = usePixPayment();

  if (loading) {
    return <CheckoutLoading />;
  }

  if (error || !produto) {
    return <CheckoutError error={error} />;
  }
  
  // Type casting to match expected types
  const typedProduto = produto as unknown as Produto;
  const typedConfigCheckout = configCheckout ? {
    ...configCheckout,
    redirect_card_status: (configCheckout.redirect_card_status || "analyzing") as "analyzing" | "approved" | "rejected"
  } as unknown as ConfigCheckout : null;
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <CheckoutHeader produto={typedProduto} configCheckout={typedConfigCheckout} />

      {/* Main content */}
      <div className="flex-grow flex justify-center py-6 px-4">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <PixPaymentHeader 
              pixTitle={pixTitle}
              beneficiaryName={beneficiaryName}
              pixSubtitle={pixSubtitle}
              secondaryColor={secondaryColor}
              primaryColor={primaryColor}
            />
            
            <div className="p-6">
              <PixQRCodeSection 
                qrCodeUrl={qrCodeUrl}
                pixKey={pixKey}
                countdown={countdown}
                formatTime={formatTime}
                primaryColor={primaryColor}
                onConfirmPayment={handleConfirmPayment}
              />
              
              <PixInstructions 
                pixInstructions={pixInstructions}
                pixSecurityMessage={pixSecurityMessage}
              />
            </div>
          </div>
          
          <OrderSummaryCard 
            produto={typedProduto}
            onBackToCheckout={handleBackToCheckout}
          />
          
          <PixPaymentFooter 
            configCheckout={typedConfigCheckout}
            securityMessage={configCheckout?.mensagem_rodape || "Pagamento 100% seguro e processado na hora"}
          />
        </div>
      </div>
    </div>
  );
};

export default PixPaymentPage;
