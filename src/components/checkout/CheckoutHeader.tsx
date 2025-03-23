
import { Produto } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

interface CheckoutHeaderProps {
  produto: Produto;
  configCheckout?: {
    mensagem_topo?: string;
    texto_botao?: string;
  };
}

export function CheckoutHeader({ produto, configCheckout }: CheckoutHeaderProps) {
  const isMobile = useIsMobile();
  
  // Choose the appropriate banner based on device type
  const bannerUrl = isMobile && produto.banner_mobile_url 
    ? produto.banner_mobile_url 
    : produto.banner_url;

  // Get banner background color (fallback to default blue if not specified)
  const bannerColor = produto.banner_color || "#3b82f6";

  // Check if we have a valid banner URL
  const hasBanner = !!bannerUrl && bannerUrl.trim() !== '';

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Top message bar - only show if no banner */}
      {!hasBanner && (
        <div className="bg-blue-600 text-center py-2 text-xs text-white font-medium">
          <p>{configCheckout?.mensagem_topo || "Oferta especial por tempo limitado!"}</p>
        </div>
      )}

      {/* Product header/banner */}
      <div className="w-full py-6 px-4 text-center">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
            <p className="text-sm text-gray-600 mb-4">{produto.descricao}</p>
            
            {hasBanner && (
              <div 
                className="mt-4 w-full max-w-3xl mx-auto rounded-md overflow-hidden shadow-md" 
                style={{ backgroundColor: bannerColor }}
              >
                <img 
                  src={bannerUrl} 
                  alt={produto.nome} 
                  className="w-full h-auto" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
