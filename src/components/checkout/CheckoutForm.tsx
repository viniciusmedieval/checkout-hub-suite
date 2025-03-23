
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatters";

export function CheckoutForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(formatPhoneNumber(value));
  };

  return (
    <Card className="checkout-card" id="checkout-form">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <User size={16} className="text-blue-600" />
          </div>
          <h3 className="checkout-heading">Identificação</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="nome" className="checkout-label">Nome completo</label>
            <Input 
              id="nome" 
              placeholder="Digite seu nome completo" 
              className="checkout-input" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="checkout-label">E-mail</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Digite seu e-mail" 
              className="checkout-input" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cpf" className="checkout-label">Documento (CPF/CNPJ)</label>
            <Input 
              id="cpf" 
              placeholder="Digite apenas números" 
              className="checkout-input" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="telefone" className="checkout-label">Celular</label>
            <div className="flex items-center">
              <div className="flex gap-1 items-center bg-gray-100 border border-[hsl(var(--checkout-border))] px-2 rounded-l-md h-10">
                <span className="text-sm text-gray-500">+55</span>
              </div>
              <Input 
                id="telefone" 
                placeholder="(00) 00000-0000" 
                className="checkout-input rounded-l-none border-l-0"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
