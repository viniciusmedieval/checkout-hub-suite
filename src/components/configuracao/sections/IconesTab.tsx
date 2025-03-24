
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "../aparencia/ColorPicker";
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleIconChange: (name: string, value: string) => void;
}

export function IconesTab({ config, handleConfigChange, handleIconChange }: IconesTabProps) {
  // Available icon options (common Lucide icons that would work well in forms)
  const iconOptions = [
    'user', 'user-circle', 'user-cog', 'user-round', 'contact',
    'mail', 'mail-check', 'mail-plus', 'at-sign', 'mail-open',
    'smartphone', 'phone', 'phone-call', 'headphones', 'device-mobile',
    'file-text', 'file', 'clipboard', 'id-card', 'scroll-text'
  ];

  // Function to display the selected icon preview
  const IconPreview = ({ iconName }: { iconName: string }) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    if (!IconComponent) return null;
    
    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-200">
        <IconComponent size={18} className={cn("text-gray-500")} style={{ color: config.cor_icones || "#8a898c" }} />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização de Ícones</CardTitle>
        <CardDescription>
          Personalize os ícones dos formulários de checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Icon color picker */}
        <div className="space-y-2">
          <Label htmlFor="cor_icones">Cor Global dos Ícones</Label>
          <ColorPicker
            name="cor_icones"
            value={config.cor_icones || "#8a898c"}
            defaultValue="#8a898c"
            onChange={handleConfigChange}
            label="Cor dos Ícones"
            description="Define a cor de todos os ícones nos formulários do checkout"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Icon selection section */}
        <div>
          <h3 className="text-sm font-medium mb-4">Escolha de Ícones para Formulários</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name field icon */}
            <div className="space-y-2">
              <Label htmlFor="icone_nome">Ícone do Campo Nome</Label>
              <div className="flex items-center gap-2">
                <IconPreview iconName={config.icone_nome || "user"} />
                <Select 
                  value={config.icone_nome || "user"} 
                  onValueChange={value => handleIconChange("icone_nome", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.slice(0, 5).map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-5">
                            {(icons as any)[icon]({ size: 14 })}
                          </span>
                          <span className="capitalize">{icon.replace(/-/g, ' ')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email field icon */}
            <div className="space-y-2">
              <Label htmlFor="icone_email">Ícone do Campo Email</Label>
              <div className="flex items-center gap-2">
                <IconPreview iconName={config.icone_email || "mail"} />
                <Select 
                  value={config.icone_email || "mail"} 
                  onValueChange={value => handleIconChange("icone_email", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.slice(5, 10).map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-5">
                            {(icons as any)[icon]({ size: 14 })}
                          </span>
                          <span className="capitalize">{icon.replace(/-/g, ' ')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone field icon */}
            <div className="space-y-2">
              <Label htmlFor="icone_telefone">Ícone do Campo Telefone</Label>
              <div className="flex items-center gap-2">
                <IconPreview iconName={config.icone_telefone || "smartphone"} />
                <Select 
                  value={config.icone_telefone || "smartphone"} 
                  onValueChange={value => handleIconChange("icone_telefone", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.slice(10, 15).map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-5">
                            {(icons as any)[icon]({ size: 14 })}
                          </span>
                          <span className="capitalize">{icon.replace(/-/g, ' ')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document field icon */}
            <div className="space-y-2">
              <Label htmlFor="icone_documento">Ícone do Campo Documento</Label>
              <div className="flex items-center gap-2">
                <IconPreview iconName={config.icone_documento || "file-text"} />
                <Select 
                  value={config.icone_documento || "file-text"} 
                  onValueChange={value => handleIconChange("icone_documento", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.slice(15, 20).map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-5">
                            {(icons as any)[icon]({ size: 14 })}
                          </span>
                          <span className="capitalize">{icon.replace(/-/g, ' ')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
