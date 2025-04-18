
import { Shield, FileText, Lock } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
    `Todos os direitos reservados. ${companyName} ${currentYear}`;

  // Corrija a lógica para mostrar a mensagem de segurança
  // Se mostrar_seguro for true, devemos exibir a mensagem de segurança
  const showSecurityMessage = Boolean(configCheckout?.mostrar_seguro);
  const securityMessage = configCheckout?.mensagem_rodape || "Compra 100% segura e garantida.";
  
  console.log("Footer config in CheckoutFooter:", {
    mostrar_seguro: configCheckout?.mostrar_seguro,
    showSecurityMessage,
    mensagem_rodape: configCheckout?.mensagem_rodape,
    footerText
  });

  return (
    <footer className="mt-auto py-4 border-t border-gray-100 text-xs" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <div className="container max-w-md mx-auto px-4">
        {/* Company name and year */}
        <div className="flex flex-wrap justify-center items-center">
          <div className="text-gray-500 text-center">
            <p>{footerText}</p>
          </div>
        </div>
        
        {/* Links section */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Button 
            variant="link" 
            size="sm" 
            asChild
            className="text-gray-400 hover:text-gray-600 transition-colors text-xs h-auto p-0"
          >
            <a 
              href={configCheckout?.url_termos_uso || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <FileText size={12} />
              Termos de uso
            </a>
          </Button>
          
          <Button 
            variant="link" 
            size="sm" 
            asChild
            className="text-gray-400 hover:text-gray-600 transition-colors text-xs h-auto p-0"
          >
            <a 
              href={configCheckout?.url_politica_privacidade || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Lock size={12} />
              Política de privacidade
            </a>
          </Button>
        </div>
        
        {/* Security message if enabled - usando Boolean para garantir checagem adequada */}
        {showSecurityMessage && (
          <div className="mt-3 flex justify-center">
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield size={12} />
              <span>{securityMessage}</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
