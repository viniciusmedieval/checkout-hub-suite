
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/types/database-types";
import { ColorPicker } from "@/components/configuracao/aparencia/ColorPicker";

interface PixButtonSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PixButtonSettings({ config, handleConfigChange }: PixButtonSettingsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto do Botão PIX</label>
        <Input
          name="texto_botao"
          value={config.texto_botao}
          onChange={handleConfigChange}
          placeholder="Ex: GARANTIR AGORA"
        />
        <p className="text-xs text-gray-500">
          Este texto será exibido no botão principal de finalização da compra via PIX.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker
          name="cor_botao"
          value={config.cor_botao || "#8B5CF6"}
          defaultValue="#8B5CF6"
          onChange={handleConfigChange}
          label="Cor do Botão PIX"
          description="Define a cor do botão de pagamento PIX"
        />
        
        <ColorPicker
          name="cor_texto_botao"
          value={config.cor_texto_botao || "#FFFFFF"}
          defaultValue="#FFFFFF"
          onChange={handleConfigChange}
          label="Cor do Texto do Botão PIX"
          description="Define a cor do texto do botão de pagamento PIX"
        />
      </div>
      
      <Separator className="my-4" />
    </>
  );
}
