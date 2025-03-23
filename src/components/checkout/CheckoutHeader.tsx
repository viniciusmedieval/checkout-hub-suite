
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

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
  const topMessageColor = configCheckout?.cor_topo || "#000000";
  
  console.log('CheckoutHeader - config values:', { 
    configCheckout,
    showTopMessage,
    topMessageColor,
    topColorFromConfig: configCheckout?.cor_topo
  });

  useEffect(() => {
    console.log('CheckoutHeader - Cor do topo atualizada:', topMessageColor);
  }, [topMessageColor]);

  return (
    <div className="w-full">
      {/* Top message bar */}
      {showTopMessage && (
        <div 
          className="text-center py-3 text-sm text-white font-medium"
          style={{ backgroundColor: topMessageColor }}
        >
          <p>{configCheckout?.mensagem_topo}</p>
        </div>
      )}

      {/* Banner */}
      <div className="w-full text-center">
        {hasBanner && (
          <div 
            className="w-full" 
            style={{ backgroundColor: bannerColor }}
          >
            <img 
              src={finalBannerUrl} 
              alt={produto.nome} 
              className="w-full h-auto max-w-[1200px] mx-auto" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
