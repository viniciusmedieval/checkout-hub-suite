
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/supabase";

interface AparenciaTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function AparenciaTab({ config, handleConfigChange, handleSwitchChange }: AparenciaTabProps) {
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
              value={config.cor_topo}
              onChange={handleConfigChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_topo"
              value={config.cor_topo}
              onChange={handleConfigChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor de Fundo do Checkout</label>
          <div className="flex gap-2">
            <Input
              type="color"
              name="cor_fundo"
              value={config.cor_fundo || "#FFFFFF"}
              onChange={handleConfigChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_fundo"
              value={config.cor_fundo || "#FFFFFF"}
              onChange={handleConfigChange}
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
              value={config.cor_banner}
              onChange={handleConfigChange}
              className="w-16 h-10 p-1"
            />
            <Input
              name="cor_banner"
              value={config.cor_banner}
              onChange={handleConfigChange}
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
