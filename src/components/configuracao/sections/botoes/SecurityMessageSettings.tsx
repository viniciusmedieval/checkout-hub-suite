
import { Input } from "@/components/ui/input";
import { ConfigCheckout } from "@/lib/types/database-types";

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
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Mensagem de Segurança</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto de Segurança</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="mensagem_rodape"
            value={config.mensagem_rodape || ""}
            onChange={handleConfigChange}
            placeholder="Ex: Compra 100% segura"
          />
        </div>
        <p className="text-xs text-gray-500">
          Este texto será exibido próximo ao botão de compra para aumentar a confiança do cliente.
        </p>
      </div>
    </div>
  );
}
