
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

interface CheckoutHeaderProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutHeader({ produto, configCheckout }: CheckoutHeaderProps) {
  const isMobile = useIsMobile();
  
  // Product banner has priority over config banner
  const bannerUrl = isMobile && produto.banner_mobile_url 
    ? produto.banner_mobile_url 
    : produto.banner_url;

  // Fallback to config banners if product has no banner
  const configBannerUrl = isMobile && configCheckout?.banner_mobile_url
    ? configCheckout.banner_mobile_url
    : configCheckout?.banner_url;
    
  // Use product banner if available, otherwise use config banner
  const finalBannerUrl = bannerUrl || configBannerUrl;

  // Get banner background color (fallback to config color, then default blue)
  const bannerColor = produto.banner_color || 
                      configCheckout?.cor_banner || 
                      "#3b82f6";

  // Check if we have a valid banner URL
  const hasBanner = !!finalBannerUrl && finalBannerUrl.trim() !== '';
  
  // Only show top message bar if banner is disabled and we have a message
  const showTopMessage = !hasBanner && 
                         configCheckout?.mensagem_topo && 
                         configCheckout.mensagem_topo.trim() !== '';

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Top message bar - only show if no banner */}
      {showTopMessage && (
        <div 
          className="text-center py-2 text-xs text-white font-medium"
          style={{ backgroundColor: configCheckout?.cor_topo || "#3b82f6" }}
        >
          <p>{configCheckout?.mensagem_topo}</p>
        </div>
      )}

      {/* Banner only */}
      <div className="w-full text-center">
        {hasBanner && (
          <div 
            className="w-full" 
            style={{ backgroundColor: bannerColor }}
          >
            <img 
              src={finalBannerUrl} 
              alt={produto.nome} 
              className="w-full h-auto" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
