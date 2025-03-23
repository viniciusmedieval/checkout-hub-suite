
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

interface CheckoutContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutContent({ produto, configCheckout }: CheckoutContentProps) {
  // Get title color from config, fallback to black if not set
  const titleColor = configCheckout?.cor_titulo || "#000000";
  
  // Log the title color for debugging
  console.log("CheckoutContent - Applying title color:", titleColor);
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Product Title with configurable color */}
      <h1 
        className="text-3xl font-bold text-center mb-8"
        style={{ color: titleColor }}
      >
        {produto.checkout_title || produto.nome}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CheckoutForm configCheckout={configCheckout} />
        </div>
        <div className="space-y-6">
          <CheckoutSummary produto={produto} configCheckout={configCheckout} />
          <CheckoutTestimonials produto_id={produto.id} />
        </div>
      </div>
    </div>
  );
}
