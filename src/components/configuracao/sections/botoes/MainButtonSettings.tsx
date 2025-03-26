
import { Input } from "@/components/ui/input";
import { ConfigCheckout } from "@/lib/types/database-types";
import { ColorPicker } from "@/components/configuracao/aparencia/ColorPicker";
import { Separator } from "@/components/ui/separator";

interface MainButtonSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function MainButtonSettings({ config, handleConfigChange }: MainButtonSettingsProps) {
  // Add debug logging
  console.log("MainButtonSettings rendering with config:", config);

  // Create local input change handler for debugging
  const handleInputChangeWithLog = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`Button text changed to: ${e.target.value}`);
    handleConfigChange(e);
  };
  
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto do Botão</label>
        <Input
          name="texto_botao"
          value={config.texto_botao || ""}
          onChange={handleInputChangeWithLog}
          placeholder="Ex: COMPRAR AGORA"
        />
        <p className="text-xs text-gray-500">
          Este texto será exibido no botão principal de finalização da compra.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorPicker
          name="cor_botao"
          value={config.cor_botao || "#8B5CF6"}
          defaultValue="#8B5CF6"
          onChange={handleConfigChange}
          label="Cor do Botão"
          description="Define a cor do botão principal"
        />
        
        <ColorPicker
          name="cor_texto_botao"
          value={config.cor_texto_botao || "#FFFFFF"}
          defaultValue="#FFFFFF"
          onChange={handleConfigChange}
          label="Cor do Texto"
          description="Define a cor do texto do botão principal"
        />
      </div>
      
      <Separator className="my-4" />
    </>
  );
}
