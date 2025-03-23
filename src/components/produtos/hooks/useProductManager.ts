
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
      }

      if (data) {
        setProducts(data);
      }
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
        const { data, error } = await supabase
          .from("produtos")
          .insert([values])
          .select();

        if (error) {
          console.error("Erro ao criar produto:", error);
          toast.error("Erro ao criar produto. Tente novamente.");
          return;
        }

        if (data && data.length > 0) {
          setProducts([...products, data[0] as Product]);
          toast.success("Produto criado com sucesso!");
        }
      }

      if (isEditing && selectedProduct) {
        const { data, error } = await supabase
          .from("produtos")
          .update(values)
          .eq("id", selectedProduct.id)
          .select();

        if (error) {
          console.error("Erro ao atualizar produto:", error);
          toast.error("Erro ao atualizar produto. Tente novamente.");
          return;
        }

        if (data && data.length > 0) {
          const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id ? (data[0] as Product) : product
          );
          setProducts(updatedProducts);
          toast.success("Produto atualizado com sucesso!");
        }
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
