
import { Input } from "@/components/ui/input";
import { ConfigCheckout } from "@/lib/supabase";
import { User, Mail, Smartphone, FileText } from "lucide-react";
import { FormData } from "@/hooks/checkout";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./utils/DynamicIcon";
import { useEffect, useState } from "react";

interface FormIdentificacaoProps {
  formData: FormData;
  errors: Record<string, boolean>;
  onChange: (name: string, value: string) => void;
  configCheckout?: ConfigCheckout | null;
}

export function FormIdentificacao({ 
  formData, 
  errors, 
  onChange,
  configCheckout
}: FormIdentificacaoProps) {
  // Determine which fields to show based on config
  const showDocumento = configCheckout?.mostrar_campo_documento !== false;
  const showTelefone = configCheckout?.mostrar_campo_telefone !== false;
  
  // Get title from config or use default
  const sectionTitle = configCheckout?.titulo_identificacao || "Identificação";
  
  // Get icon colors from config
  const iconColor = configCheckout?.cor_icones || "#8a898c";
  
  // Get icon names from config or use defaults
  const nomeIconName = configCheckout?.icone_nome || "user";
  const emailIconName = configCheckout?.icone_email || "mail";
  const telefoneIconName = configCheckout?.icone_telefone || "smartphone";
  const documentoIconName = configCheckout?.icone_documento || "file-text";
  
  // Determine whether to show Brazil flag and +55 prefix
  const showBrasilFlag = configCheckout?.mostrar_bandeira_brasil !== false;
  const showPrefixoTelefone = configCheckout?.mostrar_prefixo_telefone !== false;
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <User size={18} className="text-gray-700" />
        <h2 className="text-base font-semibold text-black">{sectionTitle}</h2>
      </div>
      
      <div className="space-y-4">
        {/* Nome */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }}>
            <DynamicIcon name={nomeIconName} size={18} />
          </div>
          <Input
            name="nome"
            placeholder="Seu nome completo"
            className={cn(
              "pl-9 h-11 bg-white text-black border border-gray-200",
              errors.nome ? "border-red-500" : ""
            )}
            value={formData.nome}
            onChange={handleChange}
          />
          {errors.nome && (
            <p className="text-red-500 text-xs mt-1">
              Nome é obrigatório
            </p>
          )}
        </div>
        
        {/* Email */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }}>
            <DynamicIcon name={emailIconName} size={18} />
          </div>
          <Input
            name="email"
            placeholder="Seu melhor e-mail"
            className={cn(
              "pl-9 h-11 bg-white text-black border border-gray-200",
              errors.email ? "border-red-500" : ""
            )}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              E-mail válido é obrigatório
            </p>
          )}
        </div>

        {/* Telefone - Exibir apenas se configurado para mostrar */}
        {showTelefone && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: iconColor }}>
              {showBrasilFlag ? (
                <DynamicIcon name="brasil-flag" size={14} />
              ) : (
                <DynamicIcon name={telefoneIconName} size={18} />
              )}
              {showPrefixoTelefone && <span className="ml-1 text-sm text-gray-600">+55</span>}
            </div>
            <Input
              name="telefone"
              placeholder="Seu telefone com DDD"
              className={cn(
                showPrefixoTelefone ? "pl-16" : showBrasilFlag ? "pl-10" : "pl-9",
                "h-11 bg-white text-black border border-gray-200",
                errors.telefone ? "border-red-500" : ""
              )}
              value={formData.telefone}
              onChange={handleChange}
            />
            {errors.telefone && (
              <p className="text-red-500 text-xs mt-1">
                Telefone válido é obrigatório
              </p>
            )}
          </div>
        )}
        
        {/* Documento (CPF/CNPJ) - Exibir apenas se configurado para mostrar */}
        {showDocumento && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: iconColor }}>
              <DynamicIcon name={documentoIconName} size={18} />
            </div>
            <Input
              name="documento"
              placeholder="CPF ou CNPJ"
              className={cn(
                "pl-9 h-11 bg-white text-black border border-gray-200",
                errors.documento ? "border-red-500" : ""
              )}
              value={formData.documento}
              onChange={handleChange}
            />
            {errors.documento && (
              <p className="text-red-500 text-xs mt-1">
                Documento válido é obrigatório
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
