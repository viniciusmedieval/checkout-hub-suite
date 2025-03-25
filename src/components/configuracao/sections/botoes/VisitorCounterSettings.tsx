
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/types/database-types";
import { ColorPicker } from "@/components/configuracao/aparencia/ColorPicker";

interface VisitorCounterSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function VisitorCounterSettings({ 
  config, 
  handleConfigChange, 
  handleSwitchChange 
}: VisitorCounterSettingsProps) {
  return (
    <>
      <h3 className="text-md font-medium">Contador de Visitantes</h3>
      <div className="flex items-center space-x-2">
        <Switch 
          checked={config.mostrar_contador === true} 
          onCheckedChange={(checked) => handleSwitchChange('mostrar_contador', checked)}
          id="mostrar-contador"
        />
        <Label htmlFor="mostrar-contador">Exibir contador de visitantes</Label>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto do Contador</label>
        <Input
          name="texto_contador"
          value={config.texto_contador || "{count} pessoas estão vendo este produto agora"}
          onChange={handleConfigChange}
          placeholder="Ex: {count} pessoas estão vendo este produto"
          disabled={config.mostrar_contador !== true}
        />
        <p className="text-xs text-gray-500">
          Use {"{count}"} para inserir o número de visitantes no texto.
        </p>
      </div>
      
      <ColorPicker
        name="cor_texto_contador"
        value={config.cor_texto_contador || "#4B5563"}
        defaultValue="#4B5563"
        onChange={handleConfigChange}
        label="Cor do Texto do Contador"
        description="Cor do texto da mensagem de contador de visitantes"
        disabled={config.mostrar_contador !== true}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mínimo de Visitantes</label>
          <Input
            type="number"
            name="contador_min"
            value={config.contador_min || 50}
            onChange={handleConfigChange}
            min="1"
            disabled={config.mostrar_contador !== true}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Máximo de Visitantes</label>
          <Input
            type="number"
            name="contador_max"
            value={config.contador_max || 200}
            onChange={handleConfigChange}
            min="1"
            disabled={config.mostrar_contador !== true}
          />
        </div>
      </div>
      
      <Separator className="my-4" />
    </>
  );
}
