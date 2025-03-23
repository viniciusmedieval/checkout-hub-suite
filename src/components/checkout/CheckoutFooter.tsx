
import { Shield } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface CheckoutFooterProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutFooter({ configCheckout }: CheckoutFooterProps) {
  return (
    <footer className="mt-auto py-4 text-center border-t border-gray-100 text-xs" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
      <div className="container max-w-md mx-auto px-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="text-center text-gray-500">
            <p>{configCheckout?.rodape_texto || '© 2023 Checkout Digital. Todos os direitos reservados.'}</p>
          </div>
          {configCheckout?.mostrar_seguro !== false && (
            <div className="text-center flex flex-col gap-2">
              <p className="flex justify-center items-center gap-1 text-gray-500">
                <Shield size={12} />
                {configCheckout?.mensagem_rodape || 'Pagamento 100% seguro'}
              </p>
              
              <a href="#" className="text-gray-400 hover:text-gray-600 underline transition-colors text-xs">
                Termos de uso e política de privacidade
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
