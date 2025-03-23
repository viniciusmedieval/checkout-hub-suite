
import { Depoimento } from "@/lib/supabase";
import { StarRating } from "./StarRating";

interface TestimonialItemProps {
  testimonial: Depoimento;
}

export function TestimonialItem({ testimonial }: TestimonialItemProps) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <img 
            src={testimonial.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`} 
            alt={testimonial.nome} 
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-800">{testimonial.nome}</h4>
            <StarRating rating={testimonial.estrelas} size="xs" />
          </div>
          <p className="text-xs text-gray-600 break-words">
            {testimonial.texto}
          </p>
        </div>
      </div>
    </div>
  );
}
