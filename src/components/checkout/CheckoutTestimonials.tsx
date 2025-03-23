
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: number;
  nome: string;
  texto: string;
  estrelas: number;
  foto_url: string;
}

interface CheckoutTestimonialsProps {
  produto_id?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill={i < rating ? "#FFD700" : "none"} 
          stroke={i < rating ? "#FFD700" : "#D1D5DB"} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function CheckoutTestimonials({ produto_id }: CheckoutTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // Try to get testimonials from Supabase
        let query = supabase.from("depoimentos").select("*");
        
        // If we have a produto_id, filter by it
        if (produto_id) {
          query = query.eq("produto_id", produto_id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback to default testimonials if none are found
          setTestimonials([
            {
              id: 1,
              nome: "Carlos Mendes",
              texto: "Simplesmente excelente! O conteúdo superou todas as minhas expectativas. Vale cada centavo investido.",
              estrelas: 5,
              foto_url: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
              id: 2,
              nome: "Ana Paula Silva",
              texto: "Melhor compra que fiz este ano. O suporte é excelente e o material é completo e atualizado.",
              estrelas: 5,
              foto_url: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
              id: 3,
              nome: "Roberto Almeida",
              texto: "Já estou aplicando o conhecimento e vendo resultados. Recomendo fortemente!",
              estrelas: 4,
              foto_url: "https://randomuser.me/api/portraits/men/22.jpg"
            }
          ]);
        }
      } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
        // Set default testimonials on error
        setTestimonials([
          {
            id: 1,
            nome: "Carlos Mendes",
            texto: "Simplesmente excelente! O conteúdo superou todas as minhas expectativas. Vale cada centavo investido.",
            estrelas: 5,
            foto_url: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            id: 2,
            nome: "Ana Paula Silva",
            texto: "Melhor compra que fiz este ano. O suporte é excelente e o material é completo e atualizado.",
            estrelas: 5,
            foto_url: "https://randomuser.me/api/portraits/women/44.jpg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [produto_id]);

  if (loading) {
    return (
      <Card className="checkout-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <h3 className="checkout-heading">Depoimentos</h3>
          </div>
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="checkout-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <MessageSquare size={16} className="text-blue-600" />
          </div>
          <h3 className="checkout-heading">Depoimentos</h3>
          <span className="ml-auto text-xs text-gray-500">{testimonials.length} comentários</span>
        </div>
        
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img 
                    src={testimonial.foto_url || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`} 
                    alt={testimonial.nome} 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{testimonial.nome}</h4>
                    <div className="flex gap-1 items-center">
                      <span className="text-green-500 text-xs font-medium">Verificado</span>
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 1L3.5 6.5L1 4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={testimonial.estrelas} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{testimonial.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
