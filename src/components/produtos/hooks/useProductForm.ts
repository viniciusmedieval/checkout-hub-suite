
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase, Produto } from '@/lib/supabase';
import { ProductFormValues } from '../schemas/productSchema';

interface UseProductFormProps {
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
  form: UseFormReturn<ProductFormValues>;
}

export function useProductForm({ product, onClose, onSuccess, form }: UseProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

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

  const handleSubmit = async (values: ProductFormValues) => {
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

  return {
    isSubmitting,
    isEditing,
    generateSlug,
    handleSubmit
  };
}
