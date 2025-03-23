
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase, ConfigCheckout, Depoimento } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Configuracao = () => {
  const [config, setConfig] = useState<ConfigCheckout>({
    id: 0,
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
  });

  const [loading, setLoading] = useState(true);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [depoimentosSaving, setDepoimentosSaving] = useState(false);

  // Fetch configuration data from Supabase
  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true);
      try {
        // Fetch checkout configuration
        const { data: checkoutConfig, error: configError } = await supabase
          .from("config_checkout")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (configError) {
          console.error("Erro ao carregar configurações do checkout:", configError);
          toast.error("Erro ao carregar configurações do checkout");
        } else if (checkoutConfig && checkoutConfig.length > 0) {
          setConfig(checkoutConfig[0]);
        }
        
        // Fetch testimonials
        const { data: testimonials, error: testimonialsError } = await supabase
          .from("depoimentos")
          .select("*")
          .order('created_at', { ascending: false });
          
        if (testimonialsError) {
          console.error("Erro ao carregar depoimentos:", testimonialsError);
          toast.error("Erro ao carregar depoimentos");
        } else if (testimonials) {
          setDepoimentos(testimonials);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveConfig = async () => {
    try {
      let result;
      
      if (config.id) {
        // Update existing record
        result = await supabase
          .from("config_checkout")
          .update({
            mensagem_topo: config.mensagem_topo,
            cor_topo: config.cor_topo,
            ativa_banner: config.ativa_banner,
            banner_url: config.banner_url,
            banner_mobile_url: config.banner_mobile_url,
            cor_banner: config.cor_banner,
            texto_botao: config.texto_botao,
            rodape_texto: config.rodape_texto,
            rodape_empresa: config.rodape_empresa,
            rodape_ano: config.rodape_ano,
            mostrar_seguro: config.mostrar_seguro,
            mensagem_rodape: config.mensagem_rodape
          })
          .eq('id', config.id);
      } else {
        // Insert new record
        result = await supabase
          .from("config_checkout")
          .insert([{
            mensagem_topo: config.mensagem_topo,
            cor_topo: config.cor_topo,
            ativa_banner: config.ativa_banner,
            banner_url: config.banner_url,
            banner_mobile_url: config.banner_mobile_url,
            cor_banner: config.cor_banner,
            texto_botao: config.texto_botao,
            rodape_texto: config.rodape_texto,
            rodape_empresa: config.rodape_empresa,
            rodape_ano: config.rodape_ano,
            mostrar_seguro: config.mostrar_seguro,
            mensagem_rodape: config.mensagem_rodape
          }]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    }
  };

  // Function to handle testimonial deletion
  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    
    setDepoimentosSaving(true);
    try {
      const { error } = await supabase
        .from("depoimentos")
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDepoimentos(prev => prev.filter(dep => dep.id !== id));
      toast.success("Depoimento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Erro ao excluir depoimento. Tente novamente.");
    } finally {
      setDepoimentosSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Configuração do Checkout</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

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
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={config.mostrar_seguro} 
                  onCheckedChange={(checked) => handleSwitchChange('mostrar_seguro', checked)}
                  id="mostrar-seguro"
                />
                <Label htmlFor="mostrar-seguro">Mostrar ícone de segurança no rodapé</Label>
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
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={config.ativa_banner} 
                  onCheckedChange={(checked) => handleSwitchChange('ativa_banner', checked)}
                  id="ativa-banner"
                />
                <Label htmlFor="ativa-banner">Ativar banner global (quando produto não tem banner)</Label>
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
                {depoimentos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum depoimento cadastrado.</p>
                  </div>
                ) : (
                  depoimentos.map((depoimento) => (
                    <Card key={depoimento.id} className="overflow-hidden border border-border">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-24 h-24 bg-secondary flex-shrink-0">
                          <img 
                            src={depoimento.foto_url} 
                            alt={depoimento.nome} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(depoimento.nome)}&background=random`;
                            }}
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
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteTestimonial(depoimento.id)}
                              disabled={depoimentosSaving}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracao;
