
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data
const mockWebhooks = [
  { 
    id: 1, 
    nome_evento: "carrinho_abandonado", 
    url_destino: "https://api.example.com/webhooks/abandoned", 
    token: "sk_test_abc123", 
    mensagem: "Olá %name%, você abandonou seu carrinho: %checkout_url%"
  },
  { 
    id: 2, 
    nome_evento: "pix_gerado", 
    url_destino: "https://api.example.com/webhooks/pix_generated", 
    token: "sk_test_def456", 
    mensagem: "PIX gerado para %email%: %pix_code%"
  },
  { 
    id: 3, 
    nome_evento: "compra_aprovada", 
    url_destino: "https://api.example.com/webhooks/purchase_approved", 
    token: "sk_test_ghi789", 
    mensagem: "Compra aprovada: %product_name% - Cliente: %name%"
  },
];

const eventoOptions = [
  { value: "carrinho_abandonado", label: "Carrinho Abandonado" },
  { value: "pix_gerado", label: "PIX Gerado" },
  { value: "pix_expirado", label: "PIX Expirado" },
  { value: "boleto_gerado", label: "Boleto Gerado" },
  { value: "boleto_expirado", label: "Boleto Expirado" },
  { value: "compra_aprovada", label: "Compra Aprovada" },
  { value: "pagamento_falhou", label: "Pagamento Falhou" },
];

const Webhooks = () => {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    nome_evento: "",
    url_destino: "",
    token: "",
    mensagem: ""
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewWebhook({
      nome_evento: "",
      url_destino: "",
      token: "",
      mensagem: ""
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWebhook(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewWebhook(prev => ({ ...prev, nome_evento: value }));
  };

  const handleSave = () => {
    if (!newWebhook.nome_evento || !newWebhook.url_destino) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newId = Math.max(0, ...webhooks.map(w => w.id)) + 1;
    setWebhooks([...webhooks, { id: newId, ...newWebhook }]);
    setIsAddingNew(false);
    toast.success("Webhook adicionado com sucesso!");
  };

  const handleDelete = (id: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast.success("Webhook removido com sucesso!");
  };

  const handleTestWebhook = (id: number) => {
    const webhook = webhooks.find(w => w.id === id);
    if (webhook) {
      toast.success(`Webhook "${getEventoLabel(webhook.nome_evento)}" enviado para teste`);
    }
  };

  const getEventoLabel = (value: string) => {
    const evento = eventoOptions.find(e => e.value === value);
    return evento ? evento.label : value;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
        <Button onClick={handleAddNew}>Adicionar Webhook</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados</CardTitle>
          <CardDescription>
            Gerencie webhooks para eventos do seu checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>URL de Destino</TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium capitalize">
                    {getEventoLabel(webhook.nome_evento)}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {webhook.url_destino}
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                      {webhook.token.substring(0, 5)}...{webhook.token.substring(webhook.token.length - 4)}
                    </code>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id)}
                    >
                      Testar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(webhook.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Webhook</CardTitle>
            <CardDescription>
              Configure um novo webhook para um evento específico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Evento</label>
              <Select 
                value={newWebhook.nome_evento}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Destino</label>
              <Input
                name="url_destino"
                value={newWebhook.url_destino}
                onChange={handleChange}
                placeholder="https://api.example.com/webhook"
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL completa para onde os dados serão enviados
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Token (Opcional)</label>
              <Input
                name="token"
                value={newWebhook.token}
                onChange={handleChange}
                placeholder="sk_test_your_token"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Token de autenticação para o webhook, se necessário
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea
                name="mensagem"
                value={newWebhook.mensagem}
                onChange={handleChange}
                placeholder="Olá %name%, seu %product_name% está disponível em %checkout_url%"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variáveis como %name%, %email%, %product_name%, %checkout_url%, etc.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar Webhook</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Webhooks;
