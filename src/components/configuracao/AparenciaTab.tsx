
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/types/database-types";
import { useEffect, useState } from "react";
import { TopBarSection } from "./aparencia/TopBarSection";
import { ProductColorSection } from "./aparencia/ProductColorSection";
import { BannerSection } from "./aparencia/BannerSection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AparenciaTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function AparenciaTab({ config, handleConfigChange, handleSwitchChange }: AparenciaTabProps) {
  // Estado para simular uma prévia das cores
  const [previewConfig, setPreviewConfig] = useState(config);
  
  // Atualizar a prévia quando as configurações mudarem
  useEffect(() => {
    setPreviewConfig(config);
  }, [config]);
  
  // Function to handle color changes and ensure both inputs (color picker and text field) stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEvent = { ...e };
    console.log(`AparenciaTab - Cor alterada: ${e.target.name} = ${e.target.value}`);
    handleConfigChange(newEvent);
  };

  // Log current config values on mount and whenever they change
  useEffect(() => {
    console.log('AparenciaTab - Valores atuais das cores:', {
      corTopo: config.cor_topo,
      corTextoTopo: config.cor_texto_topo,
      corFundo: config.cor_fundo,
      corBanner: config.cor_banner,
      corTitulo: config.cor_titulo,
      corBotao: config.cor_botao,
      corTextoBotao: config.cor_texto_botao,
      corBotaoCard: config.cor_botao_card,
      corTextoBotaoCard: config.cor_texto_botao_card
    });
  }, [config]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência visual do seu checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configurações de Cores</h3>
            <Separator />
            
            <div className="space-y-6">
              <h4 className="text-md font-medium">Topo</h4>
              <TopBarSection config={config} handleColorChange={handleColorChange} />
              
              <h4 className="text-md font-medium">Produto</h4>
              <ProductColorSection config={config} handleColorChange={handleColorChange} />
              
              <h4 className="text-md font-medium">Banner</h4>
              <BannerSection 
                config={config} 
                handleConfigChange={handleConfigChange} 
                handleColorChange={handleColorChange}
                handleSwitchChange={handleSwitchChange}
              />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Prévia das Cores</h3>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Cor do Topo</span>
                <div className="h-12 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: previewConfig.cor_topo || '#3b82f6', color: previewConfig.cor_texto_topo || '#FFFFFF' }}>
                  {previewConfig.cor_topo || '#3b82f6'}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Cor de Fundo</span>
                <div className="h-12 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: previewConfig.cor_fundo || '#FFFFFF', color: '#000000' }}>
                  {previewConfig.cor_fundo || '#FFFFFF'}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Cor do Título</span>
                <div className="h-12 rounded-md flex items-center justify-center shadow-sm border" style={{ color: previewConfig.cor_titulo || '#000000' }}>
                  <span style={{ color: previewConfig.cor_titulo || '#000000' }}>Exemplo de Título</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Botão Principal</span>
                <Button 
                  className="w-full" 
                  style={{ 
                    backgroundColor: previewConfig.cor_botao || '#8B5CF6', 
                    color: previewConfig.cor_texto_botao || '#FFFFFF',
                    border: 'none'
                  }}
                >
                  {previewConfig.texto_botao || 'Botão Principal'}
                </Button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium">Botão do Cartão</span>
                <Button 
                  className="w-full" 
                  style={{ 
                    backgroundColor: previewConfig.cor_botao_card || '#8B5CF6', 
                    color: previewConfig.cor_texto_botao_card || '#FFFFFF',
                    border: 'none'
                  }}
                >
                  {previewConfig.texto_botao_card || 'Pagar com Cartão'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
