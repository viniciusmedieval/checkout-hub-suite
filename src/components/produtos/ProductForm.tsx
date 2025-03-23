
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, Produto } from '@/lib/supabase';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { CheckoutTab } from './tabs/CheckoutTab';
import { PixConfigTab } from './tabs/PixConfigTab';
import { FormActions } from './FormActions';
import { productSchema, ProductFormValues } from './schemas/productSchema';

type ProductFormProps = {
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
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

  const onSubmit = async (values: ProductFormValues) => {
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
              <BasicInfoTab form={form} generateSlug={generateSlug} />
            </TabsContent>
            
            <TabsContent value="checkout" className="space-y-4 pt-4">
              <CheckoutTab form={form} />
            </TabsContent>
            
            <TabsContent value="pix" className="space-y-4 pt-4">
              <PixConfigTab form={form} />
            </TabsContent>
          </Tabs>
          
          <FormActions 
            isSubmitting={isSubmitting} 
            isEditing={isEditing} 
            onClose={onClose} 
          />
        </form>
      </Form>
    </div>
  );
}
