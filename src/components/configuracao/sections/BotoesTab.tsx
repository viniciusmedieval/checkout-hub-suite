
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/types/database-types";
import { VisitorCounterSettings } from "./botoes/VisitorCounterSettings";
import { SecurityMessageSettings } from "./botoes/SecurityMessageSettings";
import { PixButtonSettings } from "./botoes/PixButtonSettings";
import { CardButtonSettings } from "./botoes/CardButtonSettings";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Botões</CardTitle>
        <CardDescription>
          Configure os botões de ação e elementos interativos do checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-sm font-medium">Botão de Compra Principal</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto do Botão</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="texto_botao"
                value={config.texto_botao || ""}
                onChange={handleConfigChange}
                placeholder="Ex: COMPRAR AGORA"
              />
            </div>
            <p className="text-xs text-gray-500">
              Este texto será exibido no botão principal do checkout.
            </p>
          </div>
          
          {/* Card Button Settings */}
          <CardButtonSettings 
            config={config}
            handleConfigChange={handleConfigChange}
          />
          
          {/* PIX Button Settings */}
          <PixButtonSettings 
            config={config}
            handleConfigChange={handleConfigChange}
          />
        </div>
        
        {/* Visitor Counter Settings */}
        <VisitorCounterSettings 
          config={config}
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
        
        {/* Security Message Settings */}
        <SecurityMessageSettings 
          config={config}
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </CardContent>
    </Card>
  );
}

// Import Input component
import { Input } from "@/components/ui/input";
