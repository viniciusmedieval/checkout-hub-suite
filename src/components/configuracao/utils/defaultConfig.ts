
import { ConfigCheckout } from "@/lib/supabase";

export const defaultConfig: ConfigCheckout = {
  id: 0,
  mensagem_topo: "Oferta especial por tempo limitado! Aproveite agora.",
  cor_topo: "#3b82f6",
  cor_texto_topo: "#FFFFFF",
  ativa_banner: true,
  banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Desktop",
  banner_mobile_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Banner+Mobile",
  cor_banner: "#3b82f6",
  cor_fundo: "#FFFFFF",
  cor_titulo: "#000000",
  texto_botao: "GARANTIR AGORA",
  cor_botao: "#8B5CF6", // Alterando para um roxo vibrante como padrão
  rodape_texto: "Todos os direitos reservados.",
  rodape_empresa: "Minha Empresa LTDA",
  rodape_ano: "2023",
  mostrar_seguro: true,
  mensagem_rodape: "Compra 100% segura e garantida."
};
