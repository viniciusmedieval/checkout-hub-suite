
interface PaymentMethodIconProps {
  method: string;
}

export const PaymentMethodIcon = ({ method }: PaymentMethodIconProps) => {
  switch (method) {
    case 'pix':
      return (
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 9.5L15.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 16.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 6C10.7091 6 12.5 4.20914 12.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 6C6.29086 6 4.5 4.20914 4.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 18C13.2909 18 11.5 19.7909 11.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 18C17.7091 18 19.5 19.7909 19.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5 6C17.2909 6 15.5 4.20914 15.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5 6C21.7091 6 23.5 4.20914 23.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 18C6.70914 18 8.5 19.7909 8.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 18C2.29086 18 0.5 19.7909 0.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>PIX</span>
        </div>
      );
    case 'cartao':
      return (
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          <span>Cartão</span>
        </div>
      );
    case 'boleto':
      return (
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <line x1="6" x2="6" y1="8" y2="16"/>
            <line x1="10" x2="10" y1="8" y2="16"/>
            <line x1="14" x2="14" y1="8" y2="16"/>
            <line x1="18" x2="18" y1="8" y2="16"/>
          </svg>
          <span>Boleto</span>
        </div>
      );
    default:
      return method;
  }
};
