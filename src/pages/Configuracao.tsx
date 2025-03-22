
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data
const mockConfig = {
  mensagem_topo: "Oferta especial por tempo limitado! Aproveite agora.",
  cor_topo: "#3b82f6",
  ativa_banner: true,
  banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Desktop",
  banner_mobile_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Banner+Mobile",
  cor_banner: "#3b82f6",
  texto_botao: "GARANTIR AGORA",
  rodape_texto: "Todos os direitos reservados.",
  rodape_empresa: "Minha Empresa LTDA",
  rodape_ano: "2023",
  mostrar_seguro: true,
  mensagem_rodape: "Compra 100% segura e garantida."
};

const mockDepoimentos = [
  {
    id: 1,
    nome: "João Silva",
    texto: "Produto incrível! Superou todas as minhas expectativas.",
    estrelas: 5,
    foto_url: "https://placehold.co/200x200/10b981/FFFFFF/png?text=JS",
    produto_id: 1
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    texto: "Excelente produto, recomendo a todos que querem resultados rápidos.",
    estrelas: 4,
    foto_url: "https://placehold.co/200x200/f97316/FFFFFF/png?text=MO",
    produto_id: 1
  }
];

const Configuracao = () => {
  const [config, setConfig] = useState(mockConfig);
  const [depoimentos, setDepoimentos] = useState(mockDepoimentos);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveConfig = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configuração do Checkout</h1>
        <Button onClick={handleSaveConfig}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as principais informações do seu checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem de Topo</label>
                <Input
                  name="mensagem_topo"
                  value={config.mensagem_topo}
                  onChange={handleConfigChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Texto do Botão de Compra</label>
                <Input
                  name="texto_botao"
                  value={config.texto_botao}
                  onChange={handleConfigChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Texto do Rodapé</label>
                <Input
                  name="rodape_texto"
                  value={config.rodape_texto}
                  onChange={handleConfigChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome da Empresa</label>
                  <Input
                    name="rodape_empresa"
                    value={config.rodape_empresa}
                    onChange={handleConfigChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano do Rodapé</label>
                  <Input
                    name="rodape_ano"
                    value={config.rodape_ano}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem de Segurança</label>
                <Input
                  name="mensagem_rodape"
                  value={config.mensagem_rodape}
                  onChange={handleConfigChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência visual do seu checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cor do Topo</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    name="cor_topo"
                    value={config.cor_topo}
                    onChange={handleConfigChange}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    name="cor_topo"
                    value={config.cor_topo}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">URL do Banner (Desktop)</label>
                <Input
                  name="banner_url"
                  value={config.banner_url}
                  onChange={handleConfigChange}
                />
                <div className="mt-2 rounded-md overflow-hidden">
                  <img 
                    src={config.banner_url} 
                    alt="Banner Preview" 
                    className="w-full h-32 object-cover border border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">URL do Banner (Mobile)</label>
                <Input
                  name="banner_mobile_url"
                  value={config.banner_mobile_url}
                  onChange={handleConfigChange}
                />
                <div className="mt-2 rounded-md overflow-hidden">
                  <img 
                    src={config.banner_mobile_url}
                    alt="Banner Mobile Preview" 
                    className="w-full h-32 object-cover border border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cor de Fundo do Banner</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    name="cor_banner"
                    value={config.cor_banner}
                    onChange={handleConfigChange}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    name="cor_banner"
                    value={config.cor_banner}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depoimentos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Depoimentos</CardTitle>
              <CardDescription>
                Gerencie os depoimentos exibidos no checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button variant="outline">Adicionar Depoimento</Button>
              </div>
              
              <div className="space-y-4">
                {depoimentos.map((depoimento) => (
                  <Card key={depoimento.id} className="overflow-hidden border border-border">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-24 h-24 bg-secondary flex-shrink-0">
                        <img 
                          src={depoimento.foto_url} 
                          alt={depoimento.nome} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{depoimento.nome}</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill={i < depoimento.estrelas ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                className={i < depoimento.estrelas ? "text-yellow-500" : "text-muted-foreground"}
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{depoimento.texto}</p>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="destructive" size="sm">Excluir</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracao;
