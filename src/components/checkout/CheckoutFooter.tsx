
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface CheckoutFooterProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutFooter({ configCheckout }: CheckoutFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 text-center border-t border-gray-100 text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="container max-w-md mx-auto px-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="text-center text-gray-500">
            <p>{configCheckout?.rodape_texto || `© ${currentYear} Checkout Digital. Todos os direitos reservados.`}</p>
          </div>
          {configCheckout?.mostrar_seguro !== false && (
            <div className="text-center flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Shield size={12} className="text-green-500" />
                <span>Pagamento 100% seguro</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                <a href="#" className="text-gray-400 hover:text-gray-600 underline transition-colors text-xs">
                  Termos de uso
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 underline transition-colors text-xs">
                  Política de privacidade
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
