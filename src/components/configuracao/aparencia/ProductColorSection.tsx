
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "./ColorPicker";

interface ProductColorSectionProps {
  config: ConfigCheckout;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductColorSection({ config, handleColorChange }: ProductColorSectionProps) {
  return (
    <>
      <ColorPicker
        name="cor_titulo"
        value={config.cor_titulo}
        defaultValue="#000000"
        onChange={handleColorChange}
        label="Cor do Título do Produto"
        description="Cor do texto do título principal do produto no checkout"
      />
      
      <ColorPicker
        name="cor_fundo"
        value={config.cor_fundo}
        defaultValue="#FFFFFF"
        onChange={handleColorChange}
        label="Cor de Fundo do Checkout"
        description="Define a cor de fundo global do checkout quando o produto não tem cor personalizada"
      />
    </>
  );
}
