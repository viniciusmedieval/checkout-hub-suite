
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Produto } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { ProductFormValues } from "../schemas/productSchema";

interface UseProductFormProps {
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
  form: UseFormReturn<ProductFormValues>;
}

export function useProductForm({
  product,
  onClose,
  onSuccess,
  form
}: UseProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const generateSlug = () => {
    const productName = form.getValues("nome");
    if (!productName) return;

    const slug = productName
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    form.setValue("slug", slug);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting product data:", data);

    try {
      if (isEditing && product) {
        console.log(`Updating product with ID: ${product.id}`);
        
        const { data: updatedProduct, error } = await supabase
          .from("produtos")
          .update(data)
          .eq("id", product.id)
          .select();

        if (error) {
          console.error("Error updating product:", error);
          toast.error(`Erro ao atualizar produto: ${error.message}`);
          return;
        }

        console.log("Product updated successfully:", updatedProduct);
        toast.success("Produto atualizado com sucesso!");
        onSuccess();
        onClose();
      } else {
        console.log("Creating new product");
        
        const { data: newProduct, error } = await supabase
          .from("produtos")
          .insert([data])
          .select();

        if (error) {
          console.error("Error creating product:", error);
          toast.error(`Erro ao criar produto: ${error.message}`);
          return;
        }

        console.log("Product created successfully:", newProduct);
        toast.success("Produto criado com sucesso!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Erro inesperado ao salvar produto. Tente novamente.");
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
