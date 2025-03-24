
import { Shield, FileText, Lock } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface CheckoutFooterProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutFooter({ configCheckout }: CheckoutFooterProps) {
  // Default to current year if rodape_ano is not provided
  const currentYear = configCheckout?.rodape_ano || new Date().getFullYear().toString();
  
  // Get company name from config or use default
  const companyName = configCheckout?.rodape_empresa || "Checkout Digital";
  
  // Build footer text with company name and year
  const footerText = configCheckout?.rodape_texto || 
    `© ${currentYear} ${companyName}. Todos os direitos reservados.`;

  // Get security message from admin panel config
  const securityMessage = configCheckout?.mensagem_rodape || "Pagamento 100% seguro";

  return (
    <footer className="mt-auto py-4 border-t border-gray-100 text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="container max-w-md mx-auto px-4">
        {configCheckout?.mostrar_seguro !== false && (
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-gray-500">
              <p>{footerText}</p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <Shield size={14} className="text-green-600" />
              <span>{securityMessage}</span>
            </div>
          </div>
        )}
        
        {/* Links section */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
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
    </footer>
  );
}
