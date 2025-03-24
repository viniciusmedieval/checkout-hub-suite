
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfigCheckout } from "@/lib/supabase";
import { DynamicIcon } from "../../checkout/utils/DynamicIcon";

interface IconesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleIconChange: (name: string, value: string) => void;
}

export function IconesTab({ config, handleIconChange }: IconesTabProps) {
  // Available icon options (common Lucide icons that would work well in forms)
  const iconOptions = [
    'user', 'user-circle', 'user-cog', 'user-round', 'contact',
    'mail', 'mail-check', 'mail-plus', 'at-sign', 'mail-open',
    'smartphone', 'phone', 'phone-call', 'headphones', 'device-mobile',
    'file-text', 'file', 'clipboard', 'id-card', 'scroll-text'
  ];

  // Function to display the selected icon preview
  const IconPreview = ({ iconName }: { iconName: string }) => {
    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-200 bg-white">
        <DynamicIcon 
          name={iconName} 
          size={18} 
          color={config.cor_icones || "#8a898c"} 
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ícones do Formulário</CardTitle>
        <CardDescription>
          Personalize os ícones utilizados nos campos do formulário
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-500 mb-4">
          Selecione os ícones que serão exibidos ao lado de cada campo do formulário de identificação.
          A cor dos ícones pode ser configurada na aba Visual.
        </p>

        {/* Icon selection section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field icon */}
          <div className="space-y-3">
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
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <DynamicIcon name={icon} size={14} color={config.cor_icones || "#8a898c"} />
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
          <div className="space-y-3">
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
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <DynamicIcon name={icon} size={14} color={config.cor_icones || "#8a898c"} />
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
          <div className="space-y-3">
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
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <DynamicIcon name={icon} size={14} color={config.cor_icones || "#8a898c"} />
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
          <div className="space-y-3">
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
                        <span className="inline-flex items-center justify-center w-5 h-5">
                          <DynamicIcon name={icon} size={14} color={config.cor_icones || "#8a898c"} />
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
      </CardContent>
    </Card>
  );
}
