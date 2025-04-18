
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
        name="cor_botao"
        value={config.cor_botao}
        defaultValue="#8B5CF6"
        onChange={handleColorChange}
        label="Cor do Botão CTA"
        description="Define a cor do botão principal de chamada à ação no checkout"
      />
      
      <ColorPicker
        name="cor_texto_botao"
        value={config.cor_texto_botao}
        defaultValue="#FFFFFF"
        onChange={handleColorChange}
        label="Cor do Texto do Botão CTA"
        description="Define a cor do texto do botão principal de chamada à ação"
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
