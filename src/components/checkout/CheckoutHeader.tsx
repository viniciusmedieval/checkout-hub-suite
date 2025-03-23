
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { Clock } from "lucide-react";

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
    
  // Only use config banner if product has no banner AND config banner is activated
  const finalBannerUrl = bannerUrl || (configCheckout?.ativa_banner ? configBannerUrl : undefined);

  // Get banner background color (fallback to config color, then default black)
  const bannerColor = produto.banner_color || 
                      configCheckout?.cor_banner || 
                      "#000000";

  // Check if we have a valid banner URL
  const hasBanner = !!finalBannerUrl && finalBannerUrl.trim() !== '';
  
  // Always show top message bar if we have a message
  const showTopMessage = configCheckout?.mensagem_topo && 
                        configCheckout.mensagem_topo.trim() !== '';

  // Get the top message bar color from config
  const topMessageColor = configCheckout?.cor_topo || "#1e1e1e";
  
  // Get the top message text color from config
  const topMessageTextColor = configCheckout?.cor_texto_topo || "#FFFFFF";

  return (
    <header className="w-full">
      {/* Top urgency message bar */}
      {showTopMessage && (
        <div 
          className="py-2 text-xs font-medium text-center"
          style={{ 
            backgroundColor: topMessageColor,
            color: topMessageTextColor 
          }}
        >
          <div className="container max-w-md mx-auto px-4 flex items-center justify-center gap-2">
            <Clock size={14} />
            <p>{configCheckout?.mensagem_topo}</p>
          </div>
        </div>
      )}

      {/* Banner */}
      {hasBanner && (
        <div className="w-full text-center" style={{ backgroundColor: bannerColor }}>
          <img 
            src={finalBannerUrl} 
            alt={produto.nome} 
            className="w-full h-auto max-w-md mx-auto" 
          />
        </div>
      )}
    </header>
  );
}
