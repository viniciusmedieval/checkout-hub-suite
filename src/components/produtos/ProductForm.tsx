
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, Produto } from '@/lib/supabase';

const productSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  tipo: z.string().min(1, { message: 'Selecione um tipo de produto' }),
  valor: z.coerce.number().positive({ message: 'Valor deve ser positivo' }),
  descricao: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  ativo: z.boolean().default(true),
  slug: z.string().min(3, { message: 'Slug deve ter pelo menos 3 caracteres' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: 'Slug deve conter apenas letras minúsculas, números e hífens' 
    }),
  checkout_title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  imagem_url: z.string().url({ message: 'URL da imagem inválida' }).optional().or(z.literal('')),
  banner_url: z.string().url({ message: 'URL do banner inválida' }).optional().or(z.literal('')),
  banner_mobile_url: z.string().url({ message: 'URL do banner mobile inválida' }).optional().or(z.literal('')),
  banner_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'Cor deve estar no formato hexadecimal (ex: #FF5733)' 
  }).optional().or(z.literal('')),
  tipo_chave_pix: z.string().optional(),
  chave_pix: z.string().optional(),
  nome_beneficiario: z.string().optional(),
  usar_api_pix: z.boolean().default(false),
  usar_config_pix_global: z.boolean().default(false),
});

type ProductFormProps = {
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: product?.nome || '',
      tipo: product?.tipo || 'produto',
      valor: product?.valor || 0,
      descricao: product?.descricao || '',
      ativo: product?.ativo !== undefined ? product.ativo : true,
      slug: product?.slug || '',
      checkout_title: product?.checkout_title || '',
      imagem_url: product?.imagem_url || '',
      banner_url: product?.banner_url || '',
      banner_mobile_url: product?.banner_mobile_url || '',
      banner_color: product?.banner_color || '',
      tipo_chave_pix: product?.tipo_chave_pix || '',
      chave_pix: product?.chave_pix || '',
      nome_beneficiario: product?.nome_beneficiario || '',
      usar_api_pix: product?.usar_api_pix || false,
      usar_config_pix_global: product?.usar_config_pix_global || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsSubmitting(true);
    try {
      if (isEditing && product) {
        const { error } = await supabase
          .from('produtos')
          .update(values)
          .eq('id', product.id);
          
        if (error) throw error;
        
        toast.success(`Produto "${values.nome}" atualizado com sucesso!`);
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([values]);
          
        if (error) throw error;
        
        toast.success(`Produto "${values.nome}" criado com sucesso!`);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Ocorreu um erro ao salvar o produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const nome = form.getValues('nome');
    if (nome) {
      const slug = nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b mb-4">
        <h2 className="text-lg font-semibold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 overflow-y-auto">
          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Informações Básicas</TabsTrigger>
              <TabsTrigger value="checkout" className="flex-1">Checkout</TabsTrigger>
              <TabsTrigger value="pix" className="flex-1">Configurações PIX</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
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
            </TabsContent>
            
            <TabsContent value="checkout" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="checkout_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título no Checkout</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Compre Agora o Curso Completo!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="banner_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Banner</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/banner.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="banner_mobile_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Banner Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/banner-mobile.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="banner_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do Banner</FormLabel>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: field.value || '#ffffff' }}
                      ></div>
                      <FormControl>
                        <Input type="text" placeholder="#FF5733" {...field} />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Código hexadecimal da cor (ex: #FF5733)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="pix" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="usar_config_pix_global"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Usar Configuração Global de PIX</FormLabel>
                      <FormDescription>
                        Quando ativado, usa as configurações globais do PIX
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
              
              {!form.watch('usar_config_pix_global') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo_chave_pix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo da Chave PIX</FormLabel>
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
                              <SelectItem value="cpf">CPF</SelectItem>
                              <SelectItem value="cnpj">CNPJ</SelectItem>
                              <SelectItem value="email">E-mail</SelectItem>
                              <SelectItem value="telefone">Telefone</SelectItem>
                              <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chave_pix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave PIX</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="nome_beneficiario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Beneficiário</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="usar_api_pix"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Usar API PIX</FormLabel>
                          <FormDescription>
                            Quando ativado, usa uma API externa para gerar QR Code PIX
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
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  </span>
                  Salvando...
                </>
              ) : (
                isEditing ? 'Atualizar Produto' : 'Criar Produto'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
