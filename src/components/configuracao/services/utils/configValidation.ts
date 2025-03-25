
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { PaymentStatus } from "@/components/checkout/payment/types";

/**
 * Validates and formats a hex color value
 */
export const validateHex = (color: string): boolean => {
  return Boolean(color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color));
};

/**
 * Ensures boolean fields are properly typed
 */
export const ensureBooleanFields = (data: any): ConfigCheckout => {
  if (!data) {
    console.warn("ensureBooleanFields recebeu dados nulos ou indefinidos");
    return data;
  }
  
  // Check if redirect_card_status is a valid value
  const status = data.redirect_card_status || "analyzing";
  let validStatus: PaymentStatus = "analyzing";
  
  if (["analyzing", "approved", "rejected"].includes(status as string)) {
    validStatus = status as PaymentStatus;
  }
  
  return {
    ...data,
    mostrar_seguro: Boolean(data.mostrar_seguro),
    ativa_banner: Boolean(data.ativa_banner),
    mostrar_campo_documento: Boolean(data.mostrar_campo_documento),
    mostrar_campo_telefone: Boolean(data.mostrar_campo_telefone),
    mostrar_contador: Boolean(data.mostrar_contador),
    mostrar_bandeira_brasil: Boolean(data.mostrar_bandeira_brasil),
    mostrar_prefixo_telefone: Boolean(data.mostrar_prefixo_telefone),
    validar_cpf: Boolean(data.validar_cpf),
    validar_telefone: Boolean(data.validar_telefone),
    validar_cartao: Boolean(data.validar_cartao),
    mostrar_campo_nascimento: Boolean(data.mostrar_campo_nascimento),
    validar_nascimento: Boolean(data.validar_nascimento),
    modo_random: Boolean(data.modo_random),
    usar_api_pix_global: Boolean(data.usar_api_pix_global),
    redirect_card_status: validStatus
  };
};

/**
 * Handles error logging and notifications
 */
export const handleConfigError = (error: any, operation: string): null => {
  console.error(`Erro ao ${operation} configurações:`, error);
  toast.error(`Erro ao ${operation} configurações. Tente novamente mais tarde.`);
  return null;
};
