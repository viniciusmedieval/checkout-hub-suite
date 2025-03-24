
import { Shield, FileText, Lock } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface CheckoutFooterProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutFooter({ configCheckout }: CheckoutFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center border-t border-gray-100 text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="container max-w-md mx-auto px-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="text-center text-gray-500">
            <p>{configCheckout?.rodape_texto || `© ${currentYear} Checkout Digital. Todos os direitos reservados.`}</p>
          </div>
          {configCheckout?.mostrar_seguro !== false && (
            <div className="text-center flex flex-col gap-3">
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-600">
                <Shield size={14} className="text-green-600" />
                <span>Pagamento 100% seguro</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <a 
                  href={configCheckout?.url_termos_uso || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 hover:underline transition-colors text-xs flex items-center gap-1"
                >
                  <FileText size={12} />
                  Termos de uso
                </a>
                <a 
                  href={configCheckout?.url_politica_privacidade || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 hover:underline transition-colors text-xs flex items-center gap-1"
                >
                  <Lock size={12} />
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
