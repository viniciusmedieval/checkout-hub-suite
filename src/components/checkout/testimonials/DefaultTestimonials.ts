
import { Depoimento } from "@/lib/supabase";

// Exporting as a function to maintain compatibility with existing imports
export const getDefaultTestimonials = (): Depoimento[] => [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@example.com",
    texto: "Produto excelente! Superou todas as minhas expectativas. Recomendo muito.",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
    nota: 5,
    produto_id: null,
    criado_em: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    email: "maria@example.com",
    texto: "Muito bom! Atendeu perfeitamente às minhas necessidades.",
    avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
    nota: 4,
    produto_id: null,
    criado_em: new Date().toISOString()
  },
  {
    id: 3,
    nome: "Pedro Santos",
    email: "pedro@example.com",
    texto: "Recomendo fortemente! O suporte ao cliente é excelente.",
    avatar_url: "https://randomuser.me/api/portraits/men/2.jpg",
    nota: 5,
    produto_id: null,
    criado_em: new Date().toISOString()
  }
];

// Also export as defaultTestimonials for backward compatibility
export const defaultTestimonials = getDefaultTestimonials();
