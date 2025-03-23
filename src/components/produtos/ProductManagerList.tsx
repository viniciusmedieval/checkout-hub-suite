
import { EditIcon, LinkIcon, PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types/productTypes";

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
  
  return (
    <div className="space-y-4 mt-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
              {product.imagem_url ? (
                <img 
                  src={product.imagem_url} 
                  alt={product.nome} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <PackageIcon size={16} />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{product.nome}</div>
              <div className="text-sm text-gray-500">
                R$ {product.valor.toFixed(2)} • {product.tipo}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onCopyLink(product.slug)}
              className="text-xs h-8 px-2 flex items-center gap-1"
            >
              <LinkIcon size={14} />
              <span className="hidden sm:inline">Copiar Link</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-xs h-8 px-2 flex items-center gap-1"
            >
              <EditIcon size={14} />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
