
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ProductSearch } from "./ProductSearch";
import { ProductFilter } from "./ProductFilter";
import { ProductList } from "./ProductManagerList";
import { ProductForm } from "./ProductManagerForm";
import { useProductManager } from "./hooks/useProductManager";

export function ProductsManager() {
  const {
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
  } = useProductManager();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Button onClick={handleCreateProduct}>Criar Produto</Button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <ProductSearch search={search} setSearch={setSearch} />
        <ProductFilter filter={filter} setFilter={setFilter} />
      </div>

      {isCreating || isEditing ? (
        <ProductForm 
          isCreating={isCreating}
          isEditing={isEditing}
          selectedProduct={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <ProductList 
          products={products}
          search={search}
          filter={filter}
          onEdit={handleEditProduct}
          onCopyLink={copyCheckoutLink}
        />
      )}
    </div>
  );
}
