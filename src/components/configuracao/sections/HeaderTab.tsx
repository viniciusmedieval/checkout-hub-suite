
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "../aparencia/ColorPicker";

interface HeaderTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function HeaderTab({ config, handleConfigChange, handleSwitchChange }: HeaderTabProps) {
  // Function to handle color changes and ensure both inputs stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topo e Banner</CardTitle>
        <CardDescription>
          Configure a mensagem do topo e o banner do checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Message Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Mensagem do Topo</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto da Mensagem</label>
            <Input
              name="mensagem_topo"
              value={config.mensagem_topo || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Oferta por tempo limitado!"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              name="cor_topo"
              value={config.cor_topo}
              defaultValue="#3b82f6"
              onChange={handleColorChange}
              label="Cor de Fundo da Mensagem"
              description="Define a cor de fundo da mensagem de topo"
            />
            
            <ColorPicker
              name="cor_texto_topo"
              value={config.cor_texto_topo}
              defaultValue="#FFFFFF"
              onChange={handleColorChange}
              label="Cor do Texto da Mensagem"
              description="Define a cor do texto da mensagem de topo"
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Banner Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Banner</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Banner (Desktop)</label>
            <Input
              name="banner_url"
              value={config.banner_url || ""}
              onChange={handleConfigChange}
              placeholder="https://exemplo.com/banner.jpg"
            />
            {config.banner_url && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img 
                  src={config.banner_url} 
                  alt="Banner Preview" 
                  className="w-full h-32 object-cover border border-border"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Banner (Mobile)</label>
            <Input
              name="banner_mobile_url"
              value={config.banner_mobile_url || ""}
              onChange={handleConfigChange}
              placeholder="https://exemplo.com/banner-mobile.jpg"
            />
            {config.banner_mobile_url && (
              <div className="mt-2 rounded-md overflow-hidden">
                <img 
                  src={config.banner_mobile_url}
                  alt="Banner Mobile Preview" 
                  className="w-full h-32 object-cover border border-border"
                />
              </div>
            )}
          </div>
          
          <ColorPicker
            name="cor_banner"
            value={config.cor_banner}
            defaultValue="#000000"
            onChange={handleColorChange}
            label="Cor de Fundo do Banner"
            description="Define a cor de fundo do banner quando exibido"
          />
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={config.ativa_banner} 
              onCheckedChange={(checked) => handleSwitchChange('ativa_banner', checked)}
              id="ativa-banner"
            />
            <Label htmlFor="ativa-banner">Ativar banner global (quando produto não tem banner)</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
