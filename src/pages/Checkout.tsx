
import { useCheckout } from "@/hooks/useCheckout";
import { HeaderTimer } from "@/components/checkout/HeaderTimer";
import { BannerCheckout } from "@/components/checkout/BannerCheckout";
import { FormIdentificacao } from "@/components/checkout/FormIdentificacao";
import { PaymentMethodSelector } from "@/components/checkout/payment/PaymentMethodSelector";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { ResumoCompra } from "@/components/checkout/ResumoCompra";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";

const Checkout = () => {
  const { 
    produto, 
    configCheckout, 
    loading, 
    error,
    formData,
    formErrors,
    paymentMethod,
    isSubmitting,
    countdown,
    visitorCount,
    handleInputChange,
    setPaymentMethod,
    submitOrder
  } = useCheckout();

  if (loading) {
    return <CheckoutLoading />;
  }

  if (error || !produto) {
    return <CheckoutError error={error} />;
  }

  // Determinar a cor de fundo a ser usada (default: white)
  const backgroundColor = produto.background_color || configCheckout?.cor_fundo || "#FFFFFF";
  
  // Determinar a cor do texto a ser usada (default: black)
  const textColor = configCheckout?.cor_titulo || "#000000";

  // PixConfig para o produto atual
  const pixConfig = produto ? {
    tipo_chave_pix: produto.tipo_chave_pix,
    chave_pix: produto.chave_pix,
    nome_beneficiario: produto.nome_beneficiario
  } : null;

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header with countdown */}
      {configCheckout?.mensagem_topo && (
        <HeaderTimer 
          backgroundColor={configCheckout?.cor_topo || "#1e1e1e"}
          textColor={configCheckout?.cor_texto_topo || "#FFFFFF"}
          message={configCheckout.mensagem_topo}
        />
      )}

      {/* Banner */}
      <BannerCheckout produto={produto} configCheckout={configCheckout} />

      {/* Main checkout content */}
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-md mx-auto py-6 px-4 space-y-5">
          {/* Product Title with configurable color */}
          <h1 
            className="text-xl font-bold text-center"
            style={{ color: textColor }}
          >
            {produto.checkout_title || produto.nome}
          </h1>
          
          {/* Cliente Identification Form */}
          <FormIdentificacao 
            formData={formData} 
            errors={formErrors} 
            onChange={handleInputChange} 
          />
          
          {/* Testimonials Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CheckoutTestimonials produto_id={produto.id} />
          </div>
          
          {/* Payment Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <PaymentMethodSelector 
              productValue={produto.valor} 
              pixConfig={pixConfig}
              onPaymentMethodChange={setPaymentMethod}
              produto={produto}
            />
          </div>
          
          {/* Order Summary & CTA Button */}
          <ResumoCompra 
            produto={produto} 
            configCheckout={configCheckout}
            visitorCount={visitorCount}
            isProcessing={isSubmitting}
            onCompletePurchase={submitOrder}
          />
        </div>
      </div>
      
      {/* Footer */}
      <CheckoutFooter configCheckout={configCheckout} />
    </div>
  );
}

export default Checkout;
