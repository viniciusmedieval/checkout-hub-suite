
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/types/database-types";
import { ColorPicker } from "@/components/configuracao/aparencia/ColorPicker";

interface CardButtonSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CardButtonSettings({ config, handleConfigChange }: CardButtonSettingsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto do Botão de Cartão</label>
        <Input
          name="texto_botao_card"
          value={config.texto_botao_card || "Pagar com Cartão"}
          onChange={handleConfigChange}
          placeholder="Ex: PAGAR COM CARTÃO"
        />
        <p className="text-xs text-gray-500">
          Este texto será exibido no botão de pagamento com cartão.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker
          name="cor_botao_card"
          value={config.cor_botao_card || config.cor_botao || "#8B5CF6"}
          defaultValue="#8B5CF6"
          onChange={handleConfigChange}
          label="Cor do Botão Cartão"
          description="Define a cor do botão de pagamento com cartão"
        />
        
        <ColorPicker
          name="cor_texto_botao_card"
          value={config.cor_texto_botao_card || config.cor_texto_botao || "#FFFFFF"}
          defaultValue="#FFFFFF"
          onChange={handleConfigChange}
          label="Cor do Texto do Botão Cartão"
          description="Define a cor do texto do botão de pagamento com cartão"
        />
      </div>
      
      <Separator className="my-4" />
    </>
  );
}
