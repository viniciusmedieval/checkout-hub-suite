
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Produto } from '@/lib/supabase';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { CheckoutTab } from './tabs/CheckoutTab';
import { PixConfigTab } from './tabs/PixConfigTab';
import { FormActions } from './FormActions';
import { FormHeader } from './FormHeader';
import { productSchema, ProductFormValues } from './schemas/productSchema';
import { useProductForm } from './hooks/useProductForm';

type ProductFormProps = {
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
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
      background_color: product?.background_color || '',
      tipo_chave_pix: product?.tipo_chave_pix || '',
      chave_pix: product?.chave_pix || '',
      nome_beneficiario: product?.nome_beneficiario || '',
      usar_api_pix: product?.usar_api_pix || false,
      usar_config_pix_global: product?.usar_config_pix_global || false,
      url_api_pix: product?.url_api_pix || '',
      url_pix_api: product?.url_api_pix || '', // Using url_api_pix for both to maintain compatibility
    },
  });

  const { isSubmitting, isEditing, generateSlug, handleSubmit } = useProductForm({
    product,
    onClose,
    onSuccess,
    form
  });

  return (
    <div className="h-full flex flex-col">
      <FormHeader isEditing={isEditing} onClose={onClose} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 flex-1 overflow-y-auto">
          <ProductFormTabs 
            form={form} 
            generateSlug={generateSlug} 
          />
          
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

interface ProductFormTabsProps {
  form: ReturnType<typeof useForm<ProductFormValues>>;
  generateSlug: () => void;
}

function ProductFormTabs({ form, generateSlug }: ProductFormTabsProps) {
  return (
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
  );
}
