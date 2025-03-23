import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/supabase";
import { useEffect } from "react";

interface AparenciaTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function AparenciaTab({ config, handleConfigChange, handleSwitchChange }: AparenciaTabProps) {
  // Function to handle color changes and ensure both inputs (color picker and text field) stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`AparenciaTab - Alterando cor ${name} para ${value}`);
    
    // Garantir que a cor esteja em formato hexadecimal válido
    const validHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) 
      ? value 
      : name === 'cor_fundo' 
        ? '#FFFFFF' 
        : '#3b82f6';
    
    // Create a synthetic event to pass to the original handler
    const syntheticEvent = {
      target: {
        name,
        value: validHexColor
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleConfigChange(syntheticEvent);
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Topo</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_topo"
              value={config.cor_topo || "#000000"}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_topo"
              value={config.cor_topo || "#000000"}
              onChange={handleColorChange}
              placeholder="#000000"
            />
          </div>
          <p className="text-xs text-gray-500">Cor da barra de mensagem no topo do checkout</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Texto do Topo</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_texto_topo"
              value={config.cor_texto_topo || "#FFFFFF"}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_texto_topo"
              value={config.cor_texto_topo || "#FFFFFF"}
              onChange={handleColorChange}
              placeholder="#FFFFFF"
            />
          </div>
          <p className="text-xs text-gray-500">Cor do texto da mensagem no topo do checkout</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Título do Produto</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_titulo"
              value={config.cor_titulo || "#000000"}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_titulo"
              value={config.cor_titulo || "#000000"}
              onChange={handleColorChange}
              placeholder="#000000"
            />
          </div>
          <p className="text-xs text-gray-500">Cor do texto do título principal do produto no checkout</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor de Fundo do Checkout</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_fundo"
              value={config.cor_fundo || "#FFFFFF"}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_fundo"
              value={config.cor_fundo || "#FFFFFF"}
              onChange={handleColorChange}
              placeholder="#FFFFFF"
            />
          </div>
          <p className="text-xs text-gray-500">Define a cor de fundo global do checkout quando o produto não tem cor personalizada</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">URL do Banner (Desktop)</label>
          <Input
            name="banner_url"
            value={config.banner_url}
            onChange={handleConfigChange}
          />
          <div className="mt-2 rounded-md overflow-hidden">
            <img 
              src={config.banner_url} 
              alt="Banner Preview" 
              className="w-full h-32 object-cover border border-border"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">URL do Banner (Mobile)</label>
          <Input
            name="banner_mobile_url"
            value={config.banner_mobile_url}
            onChange={handleConfigChange}
          />
          <div className="mt-2 rounded-md overflow-hidden">
            <img 
              src={config.banner_mobile_url}
              alt="Banner Mobile Preview" 
              className="w-full h-32 object-cover border border-border"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor de Fundo do Banner</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_banner"
              value={config.cor_banner || "#000000"}
              onChange={handleColorChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_banner"
              value={config.cor_banner || "#000000"}
              onChange={handleColorChange}
              placeholder="#000000"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={config.ativa_banner} 
            onCheckedChange={(checked) => handleSwitchChange('ativa_banner', checked)}
            id="ativa-banner"
          />
          <Label htmlFor="ativa-banner">Ativar banner global (quando produto não tem banner)</Label>
        </div>
      </CardContent>
    </Card>
  );
}
