
import React from 'react';
import { LucideIcon } from 'lucide-react';

type PaymentMethod = 'card' | 'pix';

interface PaymentMethodButtonProps {
  method: PaymentMethod;
  icon: LucideIcon;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function PaymentMethodButton({
  method,
  icon: Icon,
  label,
  isSelected,
  onClick
}: PaymentMethodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
        isSelected 
          ? 'bg-primary/10 border-primary text-primary'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
