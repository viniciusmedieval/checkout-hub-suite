
import { Depoimento } from "@/lib/supabase";

export const getDefaultTestimonials = (): Depoimento[] => {
  return [
    {
      id: 1,
      nome: "Carlos Mendes",
      texto: "Simplesmente excelente! O conteúdo superou todas as minhas expectativas. Vale cada centavo investido.",
      estrelas: 5,
      foto_url: "https://randomuser.me/api/portraits/men/32.jpg",
      criado_em: new Date().toISOString()
    },
    {
      id: 2,
      nome: "Ana Paula Silva",
      texto: "Melhor compra que fiz este ano. O suporte é excelente e o material é completo e atualizado.",
      estrelas: 5,
      foto_url: "https://randomuser.me/api/portraits/women/44.jpg",
      criado_em: new Date().toISOString()
    },
    {
      id: 3,
      nome: "Roberto Almeida",
      texto: "Já estou aplicando o conhecimento e vendo resultados. Recomendo fortemente!",
      estrelas: 4,
      foto_url: "https://randomuser.me/api/portraits/men/22.jpg",
      criado_em: new Date().toISOString()
    }
  ];
};
