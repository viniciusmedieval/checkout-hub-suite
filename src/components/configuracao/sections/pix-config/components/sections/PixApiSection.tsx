
import { ConfigCheckout } from "@/lib/types/database-types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PixApiSectionProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function PixApiSection({ 
  config, 
  handleConfigChange, 
  handleSwitchChange 
}: PixApiSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          checked={config.usar_api_pix_global === true} 
          onCheckedChange={(checked) => handleSwitchChange('usar_api_pix_global', checked)}
          id="usar-api-pix"
        />
        <Label htmlFor="usar-api-pix">Usar API externa para gerar QR Code PIX (quando disponível)</Label>
      </div>
      
      {config.usar_api_pix_global && (
        <div className="space-y-2 pl-4 border-l-2 border-gray-100">
          <label className="text-sm font-medium">URL da API PIX (global)</label>
          <Input
            name="url_api_pix_global"
            value={config.url_api_pix_global || ""}
            onChange={handleConfigChange}
            placeholder="https://api.exemplo.com/gerar-pix"
          />
          <p className="text-xs text-gray-500">URL da API para geração de QR Code e códigos PIX.</p>
        </div>
      )}
    </div>
  );
}
