
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
  
  return (
    <div className="container max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Product Title with configurable color */}
      <h1 
        className="text-xl font-bold text-center mb-4"
        style={{ color: titleColor }}
      >
        {produto.checkout_title || produto.nome}
      </h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <CheckoutForm configCheckout={configCheckout} />
        </div>
        
        <CheckoutSummary produto={produto} configCheckout={configCheckout} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-base font-medium mb-4">Depoimentos</h2>
          <CheckoutTestimonials produto_id={produto.id} />
        </div>
      </div>
    </div>
  );
}
