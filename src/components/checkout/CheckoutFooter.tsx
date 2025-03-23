
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface CheckoutFooterProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutFooter({ configCheckout }: CheckoutFooterProps) {
  return (
    <footer className="mt-auto py-6 text-center border-t border-gray-100 text-sm" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-left md:text-left text-gray-500">
            <p>{configCheckout?.rodape_texto || '© 2023 Checkout Digital. Todos os direitos reservados.'}</p>
          </div>
          <div className="text-center">
            {configCheckout?.mostrar_seguro !== false && (
              <p className="flex justify-center items-center gap-1 text-gray-500">
                <Shield size={14} />
                {configCheckout?.mensagem_rodape || 'Pagamento 100% seguro'}
              </p>
            )}
          </div>
          <div className="text-right md:text-right text-gray-500">
            <p>{configCheckout?.rodape_empresa || 'Powered by'} © {configCheckout?.rodape_ano || '2023'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
