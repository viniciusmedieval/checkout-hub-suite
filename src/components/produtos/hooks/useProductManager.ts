
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Product, ProductFormValues } from "../types/productTypes";

export function useProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order('criado_em', { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao buscar produtos. Tente novamente.");
        return;
      }

      if (!data) {
        console.error("Erro: Retorno nulo do Supabase ao buscar produtos");
        toast.error("Erro ao buscar produtos. Tente novamente.");
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Erro inesperado ao buscar produtos:", error);
      toast.error("Erro inesperado ao buscar produtos. Tente novamente.");
    }
  }, []);

  const handleCreateProduct = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setIsCreating(false);
    setIsEditing(true);
    setSelectedProduct(product);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      if (isCreating) {
        // Passo 1: Inserir o novo produto - CORRIGIDO: removido .select() após insert
        const { error } = await supabase
          .from("produtos")
          .insert([values]);

        if (error) {
          console.error("Erro ao criar produto:", error);
          toast.error("Erro ao criar produto. Tente novamente.");
          return;
        }

        // Passo 2: Buscar o produto recém-criado em uma consulta separada
        const { data, error: selectError } = await supabase
          .from("produtos")
          .select("*")
          .order('id', { ascending: false })
          .limit(1)
          .single();
          
        if (selectError) {
          console.error("Erro ao buscar produto criado:", selectError);
          toast.error("Produto criado, mas houve erro ao buscar os dados.");
          await fetchProducts(); // Refresh the list anyway
          return;
        }

        if (!data) {
          console.error("Erro: Retorno nulo do Supabase após criação de produto");
          toast.error("Erro ao recuperar produto criado. Tente novamente.");
          await fetchProducts(); // Refresh the list anyway
          return;
        }

        setProducts([data as Product, ...products]);
        toast.success("Produto criado com sucesso!");
      }

      if (isEditing && selectedProduct) {
        // Passo 1: Atualizar o produto - CORRIGIDO: removido .select() após update
        const { error } = await supabase
          .from("produtos")
          .update(values)
          .eq("id", selectedProduct.id);

        if (error) {
          console.error("Erro ao atualizar produto:", error);
          toast.error("Erro ao atualizar produto. Tente novamente.");
          return;
        }

        // Passo 2: Buscar o produto atualizado em uma consulta separada
        const { data, error: selectError } = await supabase
          .from("produtos")
          .select("*")
          .eq("id", selectedProduct.id)
          .single();
          
        if (selectError) {
          console.error("Erro ao buscar produto atualizado:", selectError);
          toast.error("Produto atualizado, mas houve erro ao buscar os dados.");
          await fetchProducts(); // Refresh the list anyway
          return;
        }

        if (!data) {
          console.error("Erro: Retorno nulo do Supabase após atualização de produto");
          toast.error("Erro ao recuperar produto atualizado. Tente novamente.");
          await fetchProducts(); // Refresh the list anyway
          return;
        }

        const updatedProducts = products.map((product) =>
          product.id === selectedProduct.id ? (data as Product) : product
        );
        setProducts(updatedProducts);
        toast.success("Produto atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro inesperado ao salvar produto:", error);
      toast.error("Erro inesperado ao salvar produto. Tente novamente.");
    } finally {
      setIsCreating(false);
      setIsEditing(false);
      setSelectedProduct(null);
    }
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const copyCheckoutLink = (slug: string) => {
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${slug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        toast.success("Link de checkout copiado!");
      })
      .catch(() => {
        toast.error("Erro ao copiar link. Tente novamente.");
      });
  };

  return {
    products,
    isCreating,
    isEditing,
    selectedProduct,
    search,
    filter,
    fetchProducts,
    setSearch,
    setFilter,
    handleCreateProduct,
    handleEditProduct,
    handleFormSubmit,
    handleCancelForm,
    copyCheckoutLink
  };
}
