
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Depoimento, supabase } from "@/lib/supabase";
import { TestimonialItem } from "./testimonials/TestimonialItem";
import { TestimonialSkeleton } from "./testimonials/TestimonialSkeleton";
import { fetchTestimonials } from "@/components/configuracao/services";
import { defaultTestimonials } from "./testimonials/DefaultTestimonials";

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
        
        // Tentar buscar depoimentos do Supabase
        let data: Depoimento[] = [];
        
        try {
          if (supabase) {
            const { data: supabaseData, error } = await supabase
              .from("depoimentos")
              .select("*")
              .order('id', { ascending: false });
              
            if (error) {
              throw error;
            }
            
            if (supabaseData && supabaseData.length > 0) {
              data = supabaseData;
              console.log("CheckoutTestimonials - Depoimentos carregados do Supabase:", data.length);
            }
          } else {
            throw new Error("Cliente Supabase não inicializado");
          }
        } catch (supabaseError) {
          console.error("Erro ao buscar depoimentos do Supabase:", supabaseError);
          
          // Tentar usar o serviço de configuração como alternativa
          try {
            data = await fetchTestimonials();
            console.log("CheckoutTestimonials - Depoimentos carregados via serviço:", data.length);
          } catch (serviceError) {
            console.error("Erro ao buscar depoimentos via serviço:", serviceError);
            
            // Último recurso: usar depoimentos padrão
            data = defaultTestimonials;
            console.log("CheckoutTestimonials - Usando depoimentos padrão");
          }
        }
        
        // Se temos um produto_id específico, filtrar os depoimentos pelo produto_id ou pegar os que não têm produto_id
        if (produto_id && data.length > 0) {
          const filteredData = data.filter(item => 
            // Permitir depoimentos com produto_id igual ao atual OU depoimentos sem produto_id específico
            item.produto_id === produto_id || item.produto_id === null || item.produto_id === undefined
          );
          
          if (filteredData.length > 0) {
            setTestimonials(filteredData);
          } else {
            // Se não encontramos depoimentos específicos, usamos os genéricos
            const genericTestimonials = data.filter(item => 
              item.produto_id === null || item.produto_id === undefined
            );
            
            setTestimonials(genericTestimonials.length > 0 ? genericTestimonials : data);
          }
        } else {
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Erro fatal ao buscar depoimentos no checkout:", error);
        // Fallback para depoimentos padrão em caso de erro
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [produto_id]);

  // Se não temos depoimentos, não mostrar o componente
  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-gray-500" />
        <h3 className="text-base font-semibold text-black">Depoimentos</h3>
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
          {testimonials.map((testimonial, index) => (
            <TestimonialItem key={testimonial.id || `fallback-${index}`} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
}
