import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderTab } from "@/components/configuracao/sections/HeaderTab";
import { ConteudoTab } from "@/components/configuracao/sections/ConteudoTab";
import { FormularioTab } from "@/components/configuracao/sections/FormularioTab";
import { DepoimentosTab } from "@/components/configuracao/DepoimentosTab";
import { RodapeTab } from "@/components/configuracao/sections/RodapeTab";
import { BotoesTab } from "@/components/configuracao/sections/BotoesTab";
import { IconesTab } from "@/components/configuracao/sections/IconesTab";
import { VisualTab } from "@/components/configuracao/sections/VisualTab";
import { RedirecoesTab } from "@/components/configuracao/sections/RedirecoesTab";
import { RandomModeTab } from "@/components/configuracao/sections/RandomModeTab";
import { PixConfigTab } from "./sections/pix-config/PixConfigTab";
import { InstallmentsTab } from "@/components/configuracao/sections/InstallmentsTab";
import { ConfigCheckout } from "@/lib/types/database-types";
import { Depoimento } from "@/lib/supabase";

interface ConfigTabsProps {
  typedConfig: ConfigCheckout;
  depoimentos: Depoimento[];
  depoimentosSaving: boolean;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleIconChange: (iconField: string, iconName: string) => void;
  handleStatusChange: (status: "analyzing" | "approved" | "rejected") => void;
  handleSelectChange: (name: string, value: string | number) => void;
  handleDeleteTestimonial: (id: number) => Promise<void>;
  handleAddTestimonial: (depoimento: Omit<Depoimento, "id" | "criado_em">) => Promise<void>;
  handleUpdateTestimonial: (id: number, depoimento: Partial<Depoimento>) => Promise<void>;
}

export function ConfigTabs({
  typedConfig,
  depoimentos,
  depoimentosSaving,
  handleConfigChange,
  handleSwitchChange,
  handleIconChange,
  handleStatusChange,
  handleSelectChange,
  handleDeleteTestimonial,
  handleAddTestimonial,
  handleUpdateTestimonial
}: ConfigTabsProps) {
  return (
    <Tabs defaultValue="visual" className="w-full">
      <TabsList className="grid w-full grid-cols-11 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger value="visual" className="data-[state=active]:bg-white">Visual</TabsTrigger>
        <TabsTrigger value="header" className="data-[state=active]:bg-white">Topo</TabsTrigger>
        <TabsTrigger value="formulario" className="data-[state=active]:bg-white">Formulário</TabsTrigger>
        <TabsTrigger value="pix" className="data-[state=active]:bg-white">PIX</TabsTrigger>
        <TabsTrigger value="parcelas" className="data-[state=active]:bg-white">Parcelas</TabsTrigger>
        <TabsTrigger value="depoimentos" className="data-[state=active]:bg-white">Depoimentos</TabsTrigger>
        <TabsTrigger value="botoes" className="data-[state=active]:bg-white">Botões</TabsTrigger>
        <TabsTrigger value="icones" className="data-[state=active]:bg-white">Ícones</TabsTrigger>
        <TabsTrigger value="rodape" className="data-[state=active]:bg-white">Rodapé</TabsTrigger>
        <TabsTrigger value="redirects" className="data-[state=active]:bg-white">Redirecionamentos</TabsTrigger>
        <TabsTrigger value="random" className="data-[state=active]:bg-white">Modo Teste</TabsTrigger>
      </TabsList>

      <TabsContent value="visual" className="space-y-4 mt-4">
        <VisualTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>

      <TabsContent value="header" className="space-y-4 mt-4">
        <HeaderTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>

      <TabsContent value="formulario" className="space-y-4 mt-4">
        <FormularioTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>
      
      <TabsContent value="pix" className="space-y-4 mt-4">
        <PixConfigTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSelectChange={handleSelectChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>
      
      <TabsContent value="parcelas" className="space-y-4 mt-4">
        <InstallmentsTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
        />
      </TabsContent>

      <TabsContent value="icones" className="space-y-4 mt-4">
        <IconesTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleIconChange={handleIconChange}
        />
      </TabsContent>

      <TabsContent value="depoimentos" className="space-y-4 mt-4">
        <DepoimentosTab 
          depoimentos={depoimentos}
          depoimentosSaving={depoimentosSaving}
          handleDeleteTestimonial={handleDeleteTestimonial}
          handleAddTestimonial={handleAddTestimonial}
          handleUpdateTestimonial={handleUpdateTestimonial}
        />
      </TabsContent>

      <TabsContent value="botoes" className="space-y-4 mt-4">
        <BotoesTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>

      <TabsContent value="rodape" className="space-y-4 mt-4">
        <RodapeTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>

      <TabsContent value="redirects" className="space-y-4 mt-4">
        <RedirecoesTab 
          config={typedConfig} 
          handleConfigChange={handleConfigChange}
          handleStatusChange={handleStatusChange}
        />
      </TabsContent>

      <TabsContent value="random" className="space-y-4 mt-4">
        <RandomModeTab 
          config={typedConfig} 
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>
    </Tabs>
  );
}
