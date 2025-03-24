
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Produto } from "@/lib/types/database-types";
import { supabase } from "@/lib/supabase";
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
        
        // Update operation - do not chain with select()
        const { error } = await supabase
          .from("produtos")
          .update(data)
          .eq("id", product.id);

        if (error) {
          console.error("Error updating product:", error);
          toast.error(`Erro ao atualizar produto: ${error.message}`);
          return;
        }

        // Fetch the updated product in a separate query if needed
        const { data: updatedProduct, error: fetchError } = await supabase
          .from("produtos")
          .select("*")
          .eq("id", product.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching updated product:", fetchError);
          // Still consider the update successful even if fetching fails
        } else {
          console.log("Updated product data:", updatedProduct);
        }

        console.log("Product updated successfully");
        toast.success("Produto atualizado com sucesso!");
        onSuccess();
        onClose();
      } else {
        console.log("Creating new product");
        
        // Insert operation - do not chain with select()
        const { error } = await supabase
          .from("produtos")
          .insert([data]);

        if (error) {
          console.error("Error creating product:", error);
          toast.error(`Erro ao criar produto: ${error.message}`);
          return;
        }

        console.log("Product created successfully");
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
