/**
 * Aplica máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) dinamicamente
 */
export const formatCpfCnpj = (value: string): string => {
  const v = value.replace(/\D/g, '');
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return v
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

/**
 * Aplica máscara de Celular com DDD: (00) 00000-0000
 */
export const formatPhone = (value: string): string => {
  const v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 2) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}${v.length > 7 ? '-' + v.slice(7) : ''}`;
  }
  return v;
};

/**
 * Aplica máscara de CEP: 00000-000
 */
export const formatCep = (value: string): string => {
  const v = value.replace(/\D/g, '').slice(0, 8);
  return v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
};