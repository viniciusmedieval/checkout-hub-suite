
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Produto, supabase } from "@/lib/supabase";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!slug) {
        setError("Produto não encontrado");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando produto com slug:", slug);
        
        // Recupera dados do localStorage como fallback
        const mockStorage = localStorage.getItem('mockSupabaseStorage');
        if (mockStorage) {
          const parsedStorage = JSON.parse(mockStorage);
          if (parsedStorage && parsedStorage.produtos) {
            console.log("Dados mockStorage encontrados:", parsedStorage.produtos);
            const produtoEncontrado = parsedStorage.produtos.find(
              (p: Produto) => p.slug === slug && p.ativo
            );
            
            if (produtoEncontrado) {
              console.log("Produto encontrado nos dados mockStorage:", produtoEncontrado);
              setProduto(produtoEncontrado);
              setLoading(false);
              return;
            }
          }
        }

        // Tenta buscar no Supabase se não encontrou no mockStorage
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", slug)
          .eq("ativo", true)
          .single();

        console.log("Resposta do Supabase:", { data, error });
        
        if (error) throw error;
        
        if (!data) {
          setError("Produto não encontrado");
        } else {
          setProduto(data);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setError("Erro ao carregar o produto. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [slug]);

  const handleComprar = () => {
    toast.success("Função de compra será implementada em breve!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="space-y-4 max-w-md text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <p className="text-muted-foreground">
            {error || "O produto que você está procurando não existe ou não está mais disponível."}
          </p>
          <Button asChild>
            <Link to="/produtos" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Produtos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {produto.banner_url && (
        <div 
          className="w-full h-64 bg-cover bg-center" 
          style={{ 
            backgroundColor: produto.banner_color || '#3b82f6',
            backgroundImage: `url(${produto.banner_url})` 
          }}
        ></div>
      )}
      
      <div className="container max-w-6xl py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Link to="/produtos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Produtos
            </Link>
            
            <h1 className="text-3xl font-bold mb-4">{produto.checkout_title || produto.nome}</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Detalhes do Produto</CardTitle>
                <CardDescription>Informações sobre o produto selecionado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {produto.imagem_url && (
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome} 
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold">{produto.nome}</h3>
                <p className="text-muted-foreground whitespace-pre-line">{produto.descricao}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tipo</span>
                  <span className="text-sm capitalize">{produto.tipo}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo da Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Produto:</span>
                    <span>{produto.nome}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R$ {produto.valor.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleComprar} className="w-full">
                  Comprar Agora
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="py-6 border-t bg-background mt-auto">
        <div className="container max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2023 Checkout Digital. Todos os direitos reservados.</p>
          <p className="mt-2">Pagamento 100% seguro</p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
