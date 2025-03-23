
// Format currency helper
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Format phone number
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
};

// Format CPF
export const formatCPF = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
};

// Format card number
export const formatCardNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Group in blocks of 4
  const groups = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  
  return groups.join(' ');
};

// Format card expiry date
export const formatCardExpiry = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return digits;
  } else {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
};

// Get installments options
export const getInstallmentOptions = (value: number, maxInstallments = 12): Array<{ value: string; label: string }> => {
  const options = [];
  
  for (let i = 1; i <= maxInstallments; i++) {
    const installmentValue = value / i;
    options.push({
      value: i.toString(),
      label: `${i}x de ${formatCurrency(installmentValue)}${i === 1 ? ' à vista' : ''}`
    });
  }
  
  return options;
};
