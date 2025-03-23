
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { useEffect } from "react";
import { TopBarSection } from "./aparencia/TopBarSection";
import { ProductColorSection } from "./aparencia/ProductColorSection";
import { BannerSection } from "./aparencia/BannerSection";

interface AparenciaTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function AparenciaTab({ config, handleConfigChange, handleSwitchChange }: AparenciaTabProps) {
  // Function to handle color changes and ensure both inputs (color picker and text field) stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(e);
  };

  // Log current config values on mount and whenever they change
  useEffect(() => {
    console.log('AparenciaTab - Valores atuais das cores:', {
      corTopo: config.cor_topo,
      corTextoTopo: config.cor_texto_topo,
      corFundo: config.cor_fundo,
      corBanner: config.cor_banner,
      corTitulo: config.cor_titulo
    });
  }, [config.cor_topo, config.cor_texto_topo, config.cor_fundo, config.cor_banner, config.cor_titulo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência visual do seu checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TopBarSection config={config} handleColorChange={handleColorChange} />
        <ProductColorSection config={config} handleColorChange={handleColorChange} />
        <BannerSection 
          config={config} 
          handleConfigChange={handleConfigChange} 
          handleColorChange={handleColorChange}
          handleSwitchChange={handleSwitchChange}
        />
      </CardContent>
    </Card>
  );
}
