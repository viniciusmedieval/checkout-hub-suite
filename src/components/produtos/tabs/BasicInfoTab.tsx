
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "../schemas/productSchema";

type BasicInfoTabProps = {
  form: UseFormReturn<z.infer<typeof productSchema>>;
  generateSlug: () => void;
};

export function BasicInfoTab({ form, generateSlug }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Produto</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Curso de Marketing Digital" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="assinatura">Assinatura</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o produto em detalhes..." 
                className="resize-none" 
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="meu-produto" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateSlug}
                  className="shrink-0"
                >
                  Gerar
                </Button>
              </div>
              <FormDescription>
                Usado na URL do produto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Produto Ativo</FormLabel>
                <FormDescription>
                  Quando desativado, o produto não será exibido para compra
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="imagem_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem</FormLabel>
            <FormControl>
              <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
