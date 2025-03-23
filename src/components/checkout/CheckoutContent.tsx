
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

interface CheckoutContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutContent({ produto, configCheckout }: CheckoutContentProps) {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
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
