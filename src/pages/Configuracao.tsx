
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfiguracao } from "@/components/configuracao/useConfiguracao";
import { LoadingState } from "@/components/configuracao/LoadingState";
import { HeaderTab } from "@/components/configuracao/sections/HeaderTab";
import { ConteudoTab } from "@/components/configuracao/sections/ConteudoTab";
import { DepoimentosTab } from "@/components/configuracao/DepoimentosTab";
import { RodapeTab } from "@/components/configuracao/sections/RodapeTab";
import { BotoesTab } from "@/components/configuracao/sections/BotoesTab";
import { IconesTab } from "@/components/configuracao/sections/IconesTab";
import { GeralTab } from "@/components/configuracao/GeralTab";

const Configuracao = () => {
  const {
    config,
    loading,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleSaveConfig,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useConfiguracao();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configuração do Checkout</h1>
        <Button onClick={handleSaveConfig}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="header">Topo e Banner</TabsTrigger>
          <TabsTrigger value="conteudo">Campos e Conteúdo</TabsTrigger>
          <TabsTrigger value="icones">Ícones</TabsTrigger>
          <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
          <TabsTrigger value="botoes">Botões e Compra</TabsTrigger>
          <TabsTrigger value="rodape">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 mt-4">
          <GeralTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="header" className="space-y-4 mt-4">
          <HeaderTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-4 mt-4">
          <ConteudoTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="icones" className="space-y-4 mt-4">
          <IconesTab 
            config={config} 
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
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="rodape" className="space-y-4 mt-4">
          <RodapeTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracao;
