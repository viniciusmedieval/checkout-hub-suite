
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "./ColorPicker";

interface TopBarSectionProps {
  config: ConfigCheckout;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TopBarSection({ config, handleColorChange }: TopBarSectionProps) {
  return (
    <>
      <ColorPicker
        name="cor_topo"
        value={config.cor_topo}
        defaultValue="#000000"
        onChange={handleColorChange}
        label="Cor do Topo"
        description="Cor da barra de mensagem no topo do checkout"
      />
      
      <ColorPicker
        name="cor_texto_topo"
        value={config.cor_texto_topo}
        defaultValue="#FFFFFF"
        onChange={handleColorChange}
        label="Cor do Texto do Topo"
        description="Cor do texto da mensagem no topo do checkout"
      />
    </>
  );
}
