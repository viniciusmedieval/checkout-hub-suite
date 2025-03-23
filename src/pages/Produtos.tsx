
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase, Produto } from "@/lib/supabase";
import { ProductsManager } from "@/components/produtos/ProductsManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductSearch } from "@/components/produtos/ProductSearch";
import { ProductList } from "@/components/produtos/ProductList";
import { ProductFormWrapper } from "@/components/produtos/ProductFormWrapper";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Produto | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');
      
      if (error) throw error;
      
      setProdutos(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Falha ao carregar produtos');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const currentProduto = produtos.find(p => p.id === id);
      if (!currentProduto) return;
      
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: !currentProduto.ativo })
        .eq('id', id);
      
      if (error) throw error;
      
      setProdutos(produtos.map(produto => 
        produto.id === id ? { ...produto, ativo: !produto.ativo } : produto
      ));
      
      toast.success(`Status do produto "${currentProduto.nome}" foi alterado`);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Falha ao atualizar o status do produto');
    }
  };

  const handleOpenForm = (product?: Produto) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleProductSaved = () => {
    fetchProdutos();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Button className="flex items-center gap-2" onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <ProductSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onReload={fetchProdutos}
          />
          
          <ProductList 
            produtos={produtos}
            loading={loading}
            searchTerm={searchTerm}
            onEdit={handleOpenForm}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        <div className="space-y-4">
          <ProductsManager />
        </div>
      </div>

      <ProductFormWrapper
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        product={selectedProduct}
        onClose={handleCloseForm}
        onSuccess={handleProductSaved}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Produtos;
