
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "../aparencia/ColorPicker";
import { Separator } from "@/components/ui/separator";

interface VisualTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function VisualTab({ config, handleConfigChange, handleSwitchChange }: VisualTabProps) {
  // Function to handle color changes
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(e);
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle>Configurações Visuais</CardTitle>
        <CardDescription>
          Defina as cores e elementos visuais principais do checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores Principais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              name="cor_fundo"
              value={config.cor_fundo}
              defaultValue="#FFFFFF"
              onChange={handleColorChange}
              label="Cor de Fundo"
              description="Define a cor de fundo de toda a página"
            />
            
            <ColorPicker
              name="cor_titulo"
              value={config.cor_titulo}
              defaultValue="#000000"
              onChange={handleColorChange}
              label="Cor dos Títulos"
              description="Define a cor do título principal do produto"
            />
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores dos Botões</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              name="cor_botao"
              value={config.cor_botao}
              defaultValue="#8B5CF6"
              onChange={handleColorChange}
              label="Cor do Botão de Compra"
              description="Define a cor do botão principal de compra"
            />
            
            <ColorPicker
              name="cor_texto_botao"
              value={config.cor_texto_botao}
              defaultValue="#FFFFFF"
              onChange={handleColorChange}
              label="Cor do Texto do Botão"
              description="Define a cor do texto do botão de compra"
            />
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores dos Ícones</h3>
          
          <ColorPicker
            name="cor_icones"
            value={config.cor_icones || "#8a898c"}
            defaultValue="#8a898c"
            onChange={handleColorChange}
            label="Cor Global dos Ícones"
            description="Define a cor de todos os ícones no checkout"
          />
        </div>
      </CardContent>
    </Card>
  );
}
