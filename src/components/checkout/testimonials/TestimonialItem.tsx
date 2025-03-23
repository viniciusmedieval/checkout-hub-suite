
import { Depoimento } from "@/lib/supabase";
import { StarRating } from "./StarRating";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";

interface TestimonialItemProps {
  testimonial: Depoimento;
}

export function TestimonialItem({ testimonial }: TestimonialItemProps) {
  const [helpful, setHelpful] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img 
            src={testimonial.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`} 
            alt={testimonial.nome} 
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.nome)}&background=random`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-800">{testimonial.nome}</h4>
            <StarRating rating={testimonial.estrelas} size="sm" />
          </div>
          <p className="text-sm text-gray-600 break-words mb-2">
            {testimonial.texto}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {formatDate(testimonial.criado_em)}
            </span>
            <button 
              onClick={() => setHelpful(!helpful)}
              className={`text-xs flex items-center gap-1 ${helpful ? 'text-green-600' : 'text-gray-400'} hover:text-green-600 transition-colors`}
            >
              <ThumbsUp size={14} />
              <span>{helpful ? 'Útil' : 'Foi útil?'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
