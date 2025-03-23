
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "./ColorPicker";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BannerSectionProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BannerSection({ 
  config, 
  handleConfigChange, 
  handleColorChange, 
  handleSwitchChange 
}: BannerSectionProps) {
  return (
    <>
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
    </>
  );
}
