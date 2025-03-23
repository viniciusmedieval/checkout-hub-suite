
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Depoimento } from "@/lib/supabase";
import { TestimonialItem } from "./testimonials/TestimonialItem";
import { TestimonialSkeleton } from "./testimonials/TestimonialSkeleton";
import { fetchTestimonials } from "@/components/configuracao/services";

interface CheckoutTestimonialsProps {
  produto_id?: number;
}

export function CheckoutTestimonials({ produto_id }: CheckoutTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      setLoading(true);
      try {
        console.log("CheckoutTestimonials - Buscando depoimentos para produto_id:", produto_id);
        
        // Usar o mesmo serviço que a página de configuração usa
        const data = await fetchTestimonials();
        console.log("CheckoutTestimonials - Depoimentos carregados:", data);
        
        // Se temos um produto_id específico, filtrar os depoimentos pelo produto_id
        if (produto_id) {
          const filteredData = data.filter(item => 
            item.produto_id === produto_id || item.produto_id === 0
          );
          setTestimonials(filteredData.length > 0 ? filteredData : data);
        } else {
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Erro ao buscar depoimentos no checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [produto_id]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-gray-500" />
        <h3 className="text-base font-semibold">Depoimentos</h3>
        {!loading && (
          <span className="ml-auto text-xs text-gray-500">
            {testimonials.length} comentário{testimonials.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {loading ? (
        <TestimonialSkeleton />
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <TestimonialItem key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
}
