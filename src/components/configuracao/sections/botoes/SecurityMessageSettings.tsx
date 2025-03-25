
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <>
      <h3 className="text-md font-medium">Mensagens de Segurança</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mensagem de Destaque no Checkout</label>
        <Input
          name="mensagem_rodape"
          value={config.mensagem_rodape || ""}
          onChange={handleConfigChange}
          placeholder="Ex: Compra 100% segura e garantida"
        />
        <p className="text-xs text-gray-500">
          Esta mensagem será exibida abaixo do botão de compra.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mensagem de Termos de Compra</label>
        <Textarea
          name="mensagem_termos"
          value={config.mensagem_termos || ""}
          onChange={handleConfigChange}
          placeholder="Ex: Ao clicar em 'Comprar', você concorda com os Termos de Compra"
          className="min-h-[80px]"
        />
        <p className="text-xs text-gray-500">
          Esta mensagem será exibida abaixo do botão de compra com links para seus termos.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={config.mostrar_seguro === true} 
          onCheckedChange={(checked) => handleSwitchChange('mostrar_seguro', checked)}
          id="mostrar-seguro-botao"
        />
        <Label htmlFor="mostrar-seguro-botao">Mostrar ícone de segurança no rodapé</Label>
      </div>
    </>
  );
}
