
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rosalinda martins de Silva",
    rating: 5,
    comment: "Ótimo curso, satisfeita com o serviço. conteúdo atualizado e bem prático!",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    name: "Juliana macerado",
    rating: 5,
    comment: "melhor investimento que fiz, muito bom o conteúdo, com dicas práticas. recomendo a todos.",
    avatar: "https://i.pravatar.cc/150?img=29"
  },
  {
    id: 3,
    name: "Roberto pires",
    rating: 5,
    comment: "Curso completo e bem explicativo. Muito bom!",
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

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
          stroke="#FFD700" 
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

export function CheckoutTestimonials() {
  return (
    <Card className="border border-[#353535] bg-[#1D1D1D]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-[#FF914D]" />
            <h3 className="text-sm font-medium">Depoimentos</h3>
          </div>
          <span className="text-xs text-gray-400">2 comentários</span>
        </div>
        
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-b border-[#353535] pb-4 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      <button className="text-[#FF914D]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 10v12" />
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                        </svg>
                      </button>
                      <button className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 14V2" />
                          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <p className="text-xs text-gray-300 mt-2">{testimonial.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
