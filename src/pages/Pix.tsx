
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Mock data
const mockPixConfigs = [
  { 
    id: 1, 
    produto_id: 1, 
    produto_nome: "Curso de Marketing Digital",
    tipo_chave_pix: "cpf", 
    chave_pix: "123.456.789-00", 
    nome_beneficiario: "João da Silva",
    usar_api_pix: false,
    url_pix_api: "",
    status: "ativo"
  },
  { 
    id: 2, 
    produto_id: 2, 
    produto_nome: "E-book Finanças Pessoais",
    tipo_chave_pix: "email", 
    chave_pix: "financas@email.com", 
    nome_beneficiario: "Maria Oliveira",
    usar_api_pix: false,
    url_pix_api: "",
    status: "ativo"
  },
  { 
    id: 3, 
    produto_id: 3, 
    produto_nome: "Mentorias de Vendas",
    tipo_chave_pix: "telefone", 
    chave_pix: "+5511999998888", 
    nome_beneficiario: "Carlos Mendes",
    usar_api_pix: true,
    url_pix_api: "https://api.asaas.com/v3/pix",
    status: "inativo"
  },
];

const Pix = () => {
  const [pixConfigs, setPixConfigs] = useState(mockPixConfigs);
  const [selectedPixConfig, setSelectedPixConfig] = useState<typeof mockPixConfigs[0] | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = (pixConfig: typeof mockPixConfigs[0]) => {
    setSelectedPixConfig(pixConfig);
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!selectedPixConfig) return;
    
    setPixConfigs(pixConfigs.map(config => 
      config.id === selectedPixConfig.id ? selectedPixConfig : config
    ));
    
    setIsEditMode(false);
    setSelectedPixConfig(null);
    toast.success("Configuração PIX atualizada com sucesso!");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setSelectedPixConfig(null);
  };

  const handleToggleStatus = (id: number) => {
    setPixConfigs(pixConfigs.map(config => 
      config.id === id ? { 
        ...config, 
        status: config.status === "ativo" ? "inativo" : "ativo" 
      } : config
    ));
    
    const config = pixConfigs.find(c => c.id === id);
    toast.success(`Status da configuração PIX para "${config?.produto_nome}" foi alterado`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">PIX Checkout</h1>
        <Button>Adicionar Configuração PIX</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações PIX</CardTitle>
          <CardDescription>
            Gerencie as chaves PIX para cada produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo de Chave</TableHead>
                <TableHead>Chave PIX</TableHead>
                <TableHead>Beneficiário</TableHead>
                <TableHead>API</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pixConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.produto_nome}</TableCell>
                  <TableCell className="capitalize">{config.tipo_chave_pix}</TableCell>
                  <TableCell>{config.chave_pix}</TableCell>
                  <TableCell>{config.nome_beneficiario}</TableCell>
                  <TableCell>
                    {config.usar_api_pix ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Ativada
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Manual
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      config.status === "ativo" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {config.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(config)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant={config.status === "ativo" ? "destructive" : "default"} 
                      size="sm"
                      onClick={() => handleToggleStatus(config.id)}
                    >
                      {config.status === "ativo" ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isEditMode && selectedPixConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Configuração PIX</CardTitle>
            <CardDescription>
              Edite as configurações PIX para {selectedPixConfig.produto_nome}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Chave PIX</label>
                <Select 
                  value={selectedPixConfig.tipo_chave_pix}
                  onValueChange={(value) => setSelectedPixConfig({...selectedPixConfig, tipo_chave_pix: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de chave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Chave PIX</label>
                <Input
                  value={selectedPixConfig.chave_pix}
                  onChange={(e) => setSelectedPixConfig({...selectedPixConfig, chave_pix: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Beneficiário</label>
              <Input
                value={selectedPixConfig.nome_beneficiario}
                onChange={(e) => setSelectedPixConfig({...selectedPixConfig, nome_beneficiario: e.target.value})}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Usar API PIX</label>
                <p className="text-sm text-muted-foreground">
                  Ative para usar uma API externa para geração de PIX
                </p>
              </div>
              <Switch
                checked={selectedPixConfig.usar_api_pix}
                onCheckedChange={(checked) => setSelectedPixConfig({...selectedPixConfig, usar_api_pix: checked})}
              />
            </div>
            
            {selectedPixConfig.usar_api_pix && (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL da API PIX</label>
                <Input
                  value={selectedPixConfig.url_pix_api}
                  onChange={(e) => setSelectedPixConfig({...selectedPixConfig, url_pix_api: e.target.value})}
                  placeholder="https://api.exemplo.com/pix"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Pix;
