
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "../aparencia/ColorPicker";
import { Separator } from "@/components/ui/separator";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  // Function to handle color changes and ensure both inputs stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Botões e Área de Compra</CardTitle>
        <CardDescription>
          Configure o botão de compra e mensagens relacionadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Button Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Botão de Compra</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto do Botão</label>
            <Input
              name="texto_botao"
              value={config.texto_botao || ""}
              onChange={handleConfigChange}
              placeholder="Ex: FINALIZAR COMPRA AGORA"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              name="cor_botao"
              value={config.cor_botao}
              defaultValue="#8B5CF6"
              onChange={handleColorChange}
              label="Cor do Botão"
              description="Define a cor de fundo do botão de compra"
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
        
        {/* Messages Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Mensagens de Compra</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem de Destaque</label>
            <Input
              name="mensagem_rodape"
              value={config.mensagem_rodape || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Compra 100% segura e garantida"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta mensagem será exibida próxima ao botão de compra para criar confiança
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem de Termos</label>
            <Textarea
              name="mensagem_termos"
              value={config.mensagem_termos || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Ao clicar em comprar, você concorda com os Termos de Compra e Política de Privacidade"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta mensagem será exibida abaixo do botão para informar sobre termos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
