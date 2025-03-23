
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Produto, supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";

interface ConfigCheckout {
  mensagem_topo: string;
  texto_botao: string;
  rodape_texto: string;
  rodape_empresa: string;
  rodape_ano: string;
  mostrar_seguro: boolean;
  mensagem_rodape: string;
}

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [configCheckout, setConfigCheckout] = useState<ConfigCheckout | null>(null);
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
        
        // Fetch checkout configuration
        const { data: checkoutConfig } = await supabase
          .from("config_checkout")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (checkoutConfig && checkoutConfig.length > 0) {
          setConfigCheckout(checkoutConfig[0]);
          console.log("Config checkout carregada:", checkoutConfig[0]);
        }
        
        // Try to get product from Supabase
        const { data: productData, error: productError } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", slug)
          .eq("ativo", true)
          .single();

        console.log("Resposta do Supabase produtos:", { productData, productError });
        
        if (productError) {
          console.error("Erro do Supabase:", productError);
          throw productError;
        }
        
        if (!productData) {
          // Recupera dados do localStorage como fallback
          console.log("Produto não encontrado no Supabase, tentando localStorage");
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
          
          setError("Produto não encontrado");
        } else {
          console.log("Produto encontrado no Supabase:", productData);
          setProduto(productData);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-800">Carregando produto...</p>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="space-y-4 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
          <p className="text-gray-600">
            {error || "O produto que você está procurando não existe ou não está mais disponível."}
          </p>
          <Button asChild variant="outline">
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
    <div className="min-h-screen flex flex-col bg-[hsl(var(--checkout-bg))] text-[hsl(var(--checkout-text))]">
      {/* Header with banner */}
      <CheckoutHeader produto={produto} configCheckout={configCheckout || undefined} />

      {/* Main checkout content */}
      <div className="container max-w-3xl mx-auto py-8 px-4 space-y-6">
        <CheckoutForm />
        <CheckoutTestimonials produto_id={produto.id} />
        <CheckoutSummary produto={produto} />
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-6 text-center border-t border-gray-100 text-sm">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-left md:text-left text-gray-500">
              <p>{configCheckout?.rodape_texto || '© 2023 Checkout Digital. Todos os direitos reservados.'}</p>
            </div>
            <div className="text-center">
              <p className="flex justify-center items-center gap-1 text-gray-500">
                <Shield size={14} />
                Pagamento 100% seguro
              </p>
            </div>
            <div className="text-right md:text-right text-gray-500">
              <p>Termos de Uso | Política de Privacidade</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
