
import { Depoimento } from "@/lib/supabase";

// Exporting as a function to maintain compatibility with existing imports
export const getDefaultTestimonials = (): Depoimento[] => [
  {
    id: 1,
    nome: "João Silva",
    texto: "Produto excelente! Superou todas as minhas expectativas. Recomendo muito.",
    foto_url: "https://randomuser.me/api/portraits/men/1.jpg",
    estrelas: 5,
    produto_id: null,
    criado_em: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    texto: "Muito bom! Atendeu perfeitamente às minhas necessidades.",
    foto_url: "https://randomuser.me/api/portraits/women/1.jpg",
    estrelas: 4,
    produto_id: null,
    criado_em: new Date().toISOString()
  },
  {
    id: 3,
    nome: "Pedro Santos",
    texto: "Recomendo fortemente! O suporte ao cliente é excelente.",
    foto_url: "https://randomuser.me/api/portraits/men/2.jpg",
    estrelas: 5,
    produto_id: null,
    criado_em: new Date().toISOString()
  }
];

// Also export as defaultTestimonials for backward compatibility
export const defaultTestimonials = getDefaultTestimonials();
