
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PixConfigTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function PixConfigTab({ config, handleConfigChange, handleSelectChange, handleSwitchChange }: PixConfigTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de PIX</CardTitle>
        <CardDescription>
          Personalize as informações da página de pagamento PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título da Página PIX</label>
          <Input
            name="pix_titulo"
            value={config.pix_titulo || "Pagamento via Pix"}
            onChange={handleConfigChange}
            placeholder="Pagamento via Pix"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Subtítulo da Página PIX</label>
          <Input
            name="pix_subtitulo"
            value={config.pix_subtitulo || "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco."}
            onChange={handleConfigChange}
            placeholder="Copie o código ou use a câmera..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Instruções para Pagamento</label>
          <Input
            name="pix_instrucoes"
            value={config.pix_instrucoes || "Para realizar o pagamento:"}
            onChange={handleConfigChange}
            placeholder="Para realizar o pagamento:"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem de Segurança</label>
          <Textarea
            name="pix_mensagem_seguranca"
            value={config.pix_mensagem_seguranca || "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida."}
            onChange={handleConfigChange}
            placeholder="Mensagem sobre segurança do Pix..."
            className="min-h-[80px]"
          />
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo da Chave PIX Global</label>
            <Select 
              value={config.tipo_chave_pix_global || "email"}
              onValueChange={(value) => handleSelectChange('tipo_chave_pix_global', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
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
            <label className="text-sm font-medium">Chave PIX Global</label>
            <Input
              name="chave_pix_global"
              value={config.chave_pix_global || ""}
              onChange={handleConfigChange}
              placeholder="Sua chave PIX"
            />
            <p className="text-xs text-gray-500">Essa chave será usada quando o produto não tiver uma chave específica.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Beneficiário PIX</label>
          <Input
            name="nome_beneficiario_pix"
            value={config.nome_beneficiario_pix || ""}
            onChange={handleConfigChange}
            placeholder="Nome que aparecerá como beneficiário"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">URL da Imagem do QR Code (opcional)</label>
          <Input
            name="qr_code_pix_url"
            value={config.qr_code_pix_url || ""}
            onChange={handleConfigChange}
            placeholder="https://exemplo.com/qrcode.png"
          />
          <p className="text-xs text-gray-500">Se não for fornecido, o QR code será gerado automaticamente.</p>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Aparência da Página PIX</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor Primária</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="cor_primaria_pix"
                  value={config.cor_primaria_pix || "#1E40AF"}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                />
                <Input
                  name="cor_primaria_pix"
                  value={config.cor_primaria_pix || "#1E40AF"}
                  onChange={handleConfigChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor Secundária</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="cor_secundaria_pix"
                  value={config.cor_secundaria_pix || "#DBEAFE"}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                />
                <Input
                  name="cor_secundaria_pix"
                  value={config.cor_secundaria_pix || "#DBEAFE"}
                  onChange={handleConfigChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor do Botão PIX</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="cor_botao_pix"
                  value={config.cor_botao_pix || config.cor_botao || "#8B5CF6"}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                />
                <Input
                  name="cor_botao_pix"
                  value={config.cor_botao_pix || config.cor_botao || "#8B5CF6"}
                  onChange={handleConfigChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor do Texto do Botão PIX</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="cor_texto_botao_pix"
                  value={config.cor_texto_botao_pix || config.cor_texto_botao || "#FFFFFF"}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                />
                <Input
                  name="cor_texto_botao_pix"
                  value={config.cor_texto_botao_pix || config.cor_texto_botao || "#FFFFFF"}
                  onChange={handleConfigChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={config.usar_api_pix_global === true} 
            onCheckedChange={(checked) => handleSwitchChange('usar_api_pix_global', checked)}
            id="usar-api-pix"
          />
          <Label htmlFor="usar-api-pix">Usar API externa para gerar QR Code PIX (quando disponível)</Label>
        </div>
        
        {config.usar_api_pix_global && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-100">
            <label className="text-sm font-medium">URL da API PIX (global)</label>
            <Input
              name="url_api_pix_global"
              value={config.url_api_pix_global || ""}
              onChange={handleConfigChange}
              placeholder="https://api.exemplo.com/gerar-pix"
            />
            <p className="text-xs text-gray-500">URL da API para geração de QR Code e códigos PIX.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
