
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Mock data
const mockPixelsConfig = {
  facebook_pixel: "123456789012345",
  tiktok_pixel: "ABCDEFGHIJKLMNOP",
  google_tag_id: "GTM-ABCD1234",
  taboola_pixel: "tb-pixel-abcdefgh"
};

const mockEvents = [
  { id: 1, name: "click_button", active: true, description: "Dispara quando clica no botão" },
  { id: 2, name: "copy_pix", active: true, description: "Dispara ao copiar o código PIX" },
  { id: 3, name: "purchase_complete", active: true, description: "Dispara quando a compra é finalizada" },
  { id: 4, name: "add_to_cart", active: false, description: "Dispara ao adicionar produto ao carrinho" }
];

const Pixels = () => {
  const [pixelsConfig, setPixelsConfig] = useState(mockPixelsConfig);
  const [events, setEvents] = useState(mockEvents);
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPixelsConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEvent = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, active: !event.active } : event
    ));
    
    const event = events.find(e => e.id === id);
    toast.success(`Evento "${event?.name}" ${event?.active ? 'desativado' : 'ativado'} com sucesso!`);
  };

  const handleSavePixels = () => {
    toast.success("Configurações de pixels salvas com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pixels & Eventos</h1>
        <Button onClick={handleSavePixels}>Salvar Alterações</Button>
      </div>

      <Tabs defaultValue="pixels" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pixels">Pixels</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="pixels" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Pixels</CardTitle>
              <CardDescription>
                Configure os pixels de rastreamento das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook Pixel ID</label>
                <Input
                  name="facebook_pixel"
                  value={pixelsConfig.facebook_pixel}
                  onChange={handleConfigChange}
                  placeholder="123456789012345"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Exemplo: 123456789012345
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">TikTok Pixel ID</label>
                <Input
                  name="tiktok_pixel"
                  value={pixelsConfig.tiktok_pixel}
                  onChange={handleConfigChange}
                  placeholder="ABCDEFGHIJKLMNOP"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Exemplo: ABCDEFGHIJKLMNOP
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Tag Manager ID</label>
                <Input
                  name="google_tag_id"
                  value={pixelsConfig.google_tag_id}
                  onChange={handleConfigChange}
                  placeholder="GTM-ABCD1234"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Exemplo: GTM-ABCD1234
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Taboola Pixel ID</label>
                <Input
                  name="taboola_pixel"
                  value={pixelsConfig.taboola_pixel}
                  onChange={handleConfigChange}
                  placeholder="tb-pixel-abcdefgh"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Exemplo: tb-pixel-abcdefgh
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Código Personalizado</CardTitle>
              <CardDescription>
                Adicione códigos de rastreamento personalizados se necessário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Código Head</label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="<!-- Insira seu código aqui -->"
                ></textarea>
                <p className="text-xs text-muted-foreground mt-1">
                  Este código será inserido na tag head do seu checkout
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Eventos</CardTitle>
              <CardDescription>
                Ative ou desative eventos para rastreamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between space-x-2 p-4 border border-border rounded-lg">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${event.active ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {event.active ? 'Ativo' : 'Inativo'}
                      </span>
                      <Switch
                        checked={event.active}
                        onCheckedChange={() => handleToggleEvent(event.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evento Personalizado</CardTitle>
              <CardDescription>
                Adicione um novo evento de rastreamento personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Evento</label>
                <Input placeholder="my_custom_event" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input placeholder="Descreva quando este evento será disparado" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Código do Evento</label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="fbq('track', 'my_custom_event');"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <Button>Adicionar Evento</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pixels;
