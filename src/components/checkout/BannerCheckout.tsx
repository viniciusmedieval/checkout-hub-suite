
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfigCheckout, Produto } from "@/lib/supabase";

interface BannerCheckoutProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function BannerCheckout({ produto, configCheckout }: BannerCheckoutProps) {
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

  if (!hasBanner) return null;

  return (
    <div className="w-full text-center" style={{ backgroundColor: bannerColor }}>
      <img 
        src={finalBannerUrl} 
        alt={produto.nome} 
        className="w-full h-auto max-w-md mx-auto" 
      />
    </div>
  );
}
