
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/types/database-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralPixSettings } from "./components/GeneralPixSettings";
import { PixMensagensManager } from "../pix-mensagens/PixMensagensManager";
import { PixSecaoManager } from "../pix-mensagens/PixSecaoManager";

interface PixConfigTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function PixConfigTab({ 
  config, 
  handleConfigChange, 
  handleSelectChange, 
  handleSwitchChange 
}: PixConfigTabProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  const handleConfigUpdate = (updatedFields: Partial<ConfigCheckout>) => {
    // This function handles updates from child components
    Object.entries(updatedFields).forEach(([key, value]) => {
      // For select fields
      if (key === "tipo_chave_pix_global") {
        handleSelectChange(key, value as string);
      } 
      // For switch fields
      else if (typeof value === "boolean") {
        handleSwitchChange(key, value);
      } 
      // For text/number fields (simulate an input change event)
      else {
        const mockEvent = {
          target: {
            name: key,
            value: value
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleConfigChange(mockEvent);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="messages">Instruções de Pagamento</TabsTrigger>
          <TabsTrigger value="section">Seção de Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <GeneralPixSettings 
              config={config} 
              handleConfigChange={handleConfigChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <PixMensagensManager />
        </TabsContent>
        
        <TabsContent value="section">
          <PixSecaoManager config={config} onConfigUpdate={handleConfigUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
