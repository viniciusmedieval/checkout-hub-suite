
import { Input } from "@/components/ui/input";
import { ConfigCheckout } from "@/lib/types/database-types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SecurityMessageSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function SecurityMessageSettings({ 
  config, 
  handleConfigChange,
  handleSwitchChange 
}: SecurityMessageSettingsProps) {
  // Add debug logging
  console.log("SecurityMessageSettings rendering with config:", config);

  // Create handlers with logs
  const handleInputChangeWithLog = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`Security message changed to: ${e.target.value}`);
    handleConfigChange(e);
  };

  const handleSwitchChangeWithLog = (name: string, checked: boolean) => {
    console.log(`Switch ${name} changed to: ${checked}`);
    handleSwitchChange(name, checked);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Mensagem de Segurança</h3>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={config.mostrar_seguro || false}
          onCheckedChange={(checked) => handleSwitchChangeWithLog("mostrar_seguro", checked)}
          id="mostrar-seguro"
        />
        <Label htmlFor="mostrar-seguro">Mostrar mensagem de segurança</Label>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto de Segurança</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="mensagem_rodape"
            value={config.mensagem_rodape || ""}
            onChange={handleInputChangeWithLog}
            placeholder="Ex: Compra 100% segura"
            disabled={!config.mostrar_seguro}
          />
        </div>
        <p className="text-xs text-gray-500">
          Este texto será exibido próximo ao botão de compra para aumentar a confiança do cliente.
        </p>
      </div>
    </div>
  );
}
