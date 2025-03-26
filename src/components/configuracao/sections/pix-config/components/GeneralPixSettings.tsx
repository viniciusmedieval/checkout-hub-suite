
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/types/database-types";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PixHeaderSection } from "./sections/PixHeaderSection";
import { PixGlobalKeySection } from "./sections/PixGlobalKeySection";
import { PixAppearanceSection } from "./sections/PixAppearanceSection";
import { PixApiSection } from "./sections/PixApiSection";

interface GeneralPixSettingsProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function GeneralPixSettings({ 
  config, 
  handleConfigChange, 
  handleSelectChange, 
  handleSwitchChange 
}: GeneralPixSettingsProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Configurações Gerais do PIX</CardTitle>
        <CardDescription>
          Personalize as informações da página de pagamento PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PixHeaderSection config={config} handleConfigChange={handleConfigChange} />
        
        <Separator className="my-2" />
        
        <PixGlobalKeySection 
          config={config} 
          handleConfigChange={handleConfigChange}
          handleSelectChange={handleSelectChange}
        />
        
        <Separator className="my-2" />
        
        <PixAppearanceSection config={config} handleConfigChange={handleConfigChange} />
        
        <Separator className="my-2" />
        
        <PixApiSection 
          config={config} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </CardContent>
    </>
  );
}
