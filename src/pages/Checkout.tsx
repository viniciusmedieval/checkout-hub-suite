
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Produto, supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, CreditCard, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

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
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top message bar */}
      <div className="bg-[#1D1D1D] text-center py-2 text-xs border-b border-[#353535]">
        <p>Tempo limitado! Promoção especial por apenas 12 horas.</p>
      </div>

      {/* Product header/banner */}
      <div className="w-full bg-[#1D1D1D] py-4 px-4 text-center">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">R$ {produto.valor.toFixed(2)}</div>
            <div className="text-center">
              <h2 className="text-lg font-bold uppercase">{produto.nome}</h2>
            </div>
            <div className="text-xl font-bold">CONTEÚDOS</div>
          </div>

          {produto.banner_url && (
            <div className="mt-4">
              <img 
                src={produto.banner_url} 
                alt={produto.nome} 
                className="w-full h-auto rounded-md" 
              />
            </div>
          )}

          <div className="mt-4">
            <Button className="bg-[#F5F5F5] text-black font-bold hover:bg-white">
              PREENCHA SEUS DADOS ABAIXO
            </Button>
          </div>
        </div>
      </div>

      {/* Main checkout content */}
      <div className="container max-w-3xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Customer information section */}
          <CheckoutForm />
          
          {/* Testimonials section */}
          <CheckoutTestimonials />
          
          {/* Payment section and summary */}
          <CheckoutSummary 
            produto={produto} 
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-4 text-center bg-[#1D1D1D] text-xs">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-left md:text-left text-muted-foreground">
              <p>© 2023 Checkout Digital. Todos os direitos reservados.</p>
            </div>
            <div className="text-center">
              <p className="flex justify-center items-center gap-1">
                <Shield size={14} />
                Pagamento 100% seguro
              </p>
            </div>
            <div className="text-right md:text-right">
              <p>Termos de Uso | Política de Privacidade</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
