
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);

  // Efeito para atualizar cor de fundo quando a configuração ou o produto muda
  useEffect(() => {
    if (!loading) {
      // Prioridade: cor do produto > cor da configuração > branco (padrão)
      const backgroundColor = produto?.background_color || 
                             configCheckout?.cor_fundo || 
                             "#FFFFFF";
      
      console.log("Checkout - Aplicando cor de fundo final:", backgroundColor);
      document.body.style.backgroundColor = backgroundColor;
      // Adiciona uma classe específica para personalização adicional
      document.body.classList.add('checkout-page');
    }
    
    // Limpar estilo ao desmontar o componente
    return () => {
      document.body.style.backgroundColor = '';
      document.body.classList.remove('checkout-page');
    };
  }, [produto, configCheckout, loading]);

  if (loading) {
    return <CheckoutLoading />;
  }

  if (error || !produto) {
    return <CheckoutError error={error} />;
  }

  // Determinar a cor de fundo a ser usada
  const backgroundColor = produto.background_color || configCheckout?.cor_fundo || "#FFFFFF";

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header with banner */}
      <CheckoutHeader produto={produto} configCheckout={configCheckout} />

      {/* Main checkout content */}
      <div className="flex-grow flex justify-center">
        <CheckoutContent produto={produto} configCheckout={configCheckout} />
      </div>
      
      {/* Footer */}
      <CheckoutFooter configCheckout={configCheckout} />
    </div>
  );
};

export default Checkout;
