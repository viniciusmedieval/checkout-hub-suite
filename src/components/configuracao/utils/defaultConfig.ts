
import { ConfigCheckout } from "@/lib/supabase";

export const DEFAULT_CONFIG: ConfigCheckout = {
  id: 0,
  mensagem_topo: "Oferta especial por tempo limitado! Aproveite agora.",
  cor_topo: "#3b82f6",
  ativa_banner: true,
  banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Desktop",
  banner_mobile_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Banner+Mobile",
  cor_banner: "#3b82f6",
  cor_fundo: "#FFFFFF",
  cor_titulo: "#000000", // Default title color
  texto_botao: "GARANTIR AGORA",
  rodape_texto: "Todos os direitos reservados.",
  rodape_empresa: "Minha Empresa LTDA",
  rodape_ano: "2023",
  mostrar_seguro: true,
  mensagem_rodape: "Compra 100% segura e garantida."
};
