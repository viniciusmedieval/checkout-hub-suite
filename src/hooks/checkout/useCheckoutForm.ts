
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateEmail, validateCPF, validateMobilePhone, validateBirthDate } from "./useValidation";
import { supabase } from "@/lib/supabase";
import { Produto, ConfigCheckout } from "@/lib/supabase";

export type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  data_nascimento?: string;
};

export const useCheckoutForm = (produto: Produto | null, configCheckout?: ConfigCheckout | null) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
    data_nascimento: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which fields to validate based on config
  const shouldValidateDocumento = configCheckout?.mostrar_campo_documento !== false;
  const shouldValidateTelefone = configCheckout?.mostrar_campo_telefone !== false;
  const shouldShowDataNascimento = configCheckout?.mostrar_campo_nascimento === true;
  const shouldValidateCpf = configCheckout?.validar_cpf === true;
  const shouldValidateTelefoneFormat = configCheckout?.validar_telefone === true;
  const shouldValidateDataNascimento = configCheckout?.validar_nascimento === true;

  // Reset form errors when input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.nome.trim()) errors.nome = true;
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = true;
    
    // Only validate phone if it's required by config
    if (shouldValidateTelefone) {
      if (!formData.telefone.trim()) {
        errors.telefone = true;
      } else if (shouldValidateTelefoneFormat) {
        const telefoneDigits = formData.telefone.replace(/\D/g, '');
        if (!validateMobilePhone(telefoneDigits)) {
          errors.telefone = true;
        }
      }
    }
    
    // Only validate document if it's required by config
    if (shouldValidateDocumento) {
      if (!formData.documento.trim()) {
        errors.documento = true;
      } else if (shouldValidateCpf) {
        const documentoDigits = formData.documento.replace(/\D/g, '');
        if (documentoDigits.length === 11 && !validateCPF(formData.documento)) {
          errors.documento = true;
        } else if (documentoDigits.length !== 11 && documentoDigits.length !== 14) {
          errors.documento = true;
        }
      }
    }
    
    // Validate birth date if field is shown and validation is enabled
    if (shouldShowDataNascimento) {
      if (!formData.data_nascimento?.trim()) {
        errors.data_nascimento = true;
      } else if (shouldValidateDataNascimento) {
        if (!validateBirthDate(formData.data_nascimento)) {
          errors.data_nascimento = true;
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order
  const submitOrder = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os campos destacados");
      return;
    }

    if (!produto) {
      toast.error("Produto não encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Dados do cliente para inserir no Supabase
      const clienteData = {
        nome: formData.nome,
        email: formData.email,
        celular: formData.telefone,
        documento: formData.documento,
        data_nascimento: formData.data_nascimento,
        produto_id: produto.id,
        criado_em: new Date().toISOString()
      };

      // Inserir na tabela clientes
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData]);

      if (error) throw error;

      toast.success("Pedido finalizado com sucesso!");
      
      // Reset form after successful submission
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        documento: "",
        data_nascimento: ""
      });
      
      // Redirect to thank you page or show success message
      // window.location.href = `/obrigado/${slug}`;
      
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      toast.error("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    submitOrder,
    validateForm
  };
};
