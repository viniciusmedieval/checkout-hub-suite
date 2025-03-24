
// Validation utilities for checkout form

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Must be 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // First verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder > 9 ? 0 : remainder;
  
  // Second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder > 9 ? 0 : remainder;
  
  // Check if calculated verification digits match with the given digits
  return (
    parseInt(cleanCPF.charAt(9)) === digit1 &&
    parseInt(cleanCPF.charAt(10)) === digit2
  );
};

export const validateMobilePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Brazilian mobile phones have 11 digits (with DDD)
  return cleanPhone.length === 11;
};

export const validateCreditCard = (cardNumber: string): boolean => {
  const cleanCardNumber = cardNumber.replace(/\D/g, '');
  
  // Card number should be between 13 and 19 digits
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm (mod 10)
  let sum = 0;
  let shouldDouble = false;
  
  // Loop from right to left
  for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCardNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

export const validateBirthDate = (date: string): boolean => {
  // Check if the date is in the format DD/MM/YYYY
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return false;
  }
  
  const [day, month, year] = date.split('/').map(part => parseInt(part, 10));
  
  // Create date object and check if it's valid
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return false;
  }
  
  // Check if the person is at least 18 years old
  const today = new Date();
  const minAge = 18;
  const minBirthDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  
  return dateObj <= minBirthDate;
};

export const formatBirthDate = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }
};
