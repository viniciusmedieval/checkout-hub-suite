
import { Product } from "./types/productTypes";
import { ProductCard } from "./product-list/ProductCard";
import { EmptyProductList } from "./product-list/EmptyProductList";

interface ProductListProps {
  products: Product[];
  search: string;
  filter: string;
  onEdit: (product: Product) => void;
  onCopyLink: (slug: string) => void;
}

export function ProductList({ products, search, filter, onEdit, onCopyLink }: ProductListProps) {
  const searchTerm = search.toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchTerm) ||
      product.tipo.toLowerCase().includes(searchTerm) ||
      product.descricao.toLowerCase().includes(searchTerm);

    const matchesFilter =
      filter === "todos" ||
      (filter === "ativos" && product.ativo) ||
      (filter === "inativos" && !product.ativo);

    return matchesSearch && matchesFilter;
  });
  
  if (filteredProducts.length === 0) {
    return <EmptyProductList searchTerm={search} />;
  }

  return (
    <div className="space-y-4 mt-4">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onCopyLink={onCopyLink}
        />
      ))}
    </div>
  );
}
