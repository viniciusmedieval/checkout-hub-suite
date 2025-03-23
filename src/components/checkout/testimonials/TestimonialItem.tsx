
import { Depoimento } from "@/lib/supabase";
import { StarRating } from "./StarRating";

interface TestimonialItemProps {
  testimonial: Depoimento;
}

export function TestimonialItem({ testimonial }: TestimonialItemProps) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <img 
            src={testimonial.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`} 
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
  );
}
