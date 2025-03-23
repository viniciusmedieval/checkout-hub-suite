
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { supabase, Depoimento } from "@/lib/supabase";
import { TestimonialItem } from "./testimonials/TestimonialItem";
import { TestimonialSkeleton } from "./testimonials/TestimonialSkeleton";
import { getDefaultTestimonials } from "./testimonials/DefaultTestimonials";

interface CheckoutTestimonialsProps {
  produto_id?: number;
}

export function CheckoutTestimonials({ produto_id }: CheckoutTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        console.log("Fetching testimonials for produto_id:", produto_id);
        
        // Try to get testimonials from Supabase
        let query = supabase.from("depoimentos").select("*");
        
        // If we have a produto_id, filter by it
        if (produto_id) {
          query = query.eq("produto_id", produto_id);
        }
        
        const { data, error } = await query.order('criado_em', { ascending: false });
        
        if (error) {
          console.error("Error fetching testimonials:", error);
          throw error;
        }
        
        console.log("Testimonials fetched:", data);
        
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          console.log("No testimonials found, using defaults");
          // Fallback to default testimonials if none are found
          setTestimonials(getDefaultTestimonials());
        }
      } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
        // Set default testimonials on error
        setTestimonials(getDefaultTestimonials());
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [produto_id]);

  return (
    <Card className="border border-gray-100 bg-white shadow-sm rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <MessageSquare size={16} className="text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Depoimentos</h3>
          {!loading && <span className="ml-auto text-xs text-gray-500">{testimonials.length} comentários</span>}
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
      </CardContent>
    </Card>
  );
}
