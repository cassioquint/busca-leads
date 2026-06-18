export const formatSearchLabel = (query: string, city: string): string => {
  if (!query || !city) return '';

  const trimmedQuery = query.trim();

  // 1. Função para pluralizar palavras em Português (Brasil)
  const pluralize = (word: string): string => {
    const lowerWord = word.toLowerCase();

    // Se já termina com 's', assumimos que já está no plural (ex: "Padarias", "Petshops")
    if (lowerWord.endsWith('s')) return word;

    // Regras específicas do português
    if (lowerWord.endsWith('m')) {
      return word.slice(0, -1) + 'ns'; // Garagem -> Garagens
    }
    if (lowerWord.endsWith('r') || lowerWord.endsWith('z')) {
      return word + 'es'; // Bar -> Bares, Luz -> Luzes
    }
    if (lowerWord.match(/[aeou]l$/)) {
      return word.slice(0, -1) + 'is'; // Hospital -> Hospitais
    }
    if (lowerWord.endsWith('il')) {
      return word.slice(0, -2) + 'is'; // Perfil -> Perfis
    }
    if (lowerWord.endsWith('ão')) {
      return word.slice(0, -2) + 'ões'; // Construção -> Construções (regra geral mais comum)
    }

    // Regra padrão: adiciona 's' (para vogais e demais consoantes)
    return word + 's';
  };

  // 2. Separa as palavras para pluralizar apenas a primeira (núcleo do sujeito)
  const words = trimmedQuery.split(' ');
  const firstWordPluralized = pluralize(words[0]);
  
  // Junta a primeira palavra pluralizada com o resto da frase (se houver)
  const finalQuery = [firstWordPluralized, ...words.slice(1)].join(' ');

  // 3. Capitaliza a primeira letra de toda a string
  const capitalizedQuery = finalQuery.charAt(0).toUpperCase() + finalQuery.slice(1);

  // 4. Retorna a frase montada
  return `${capitalizedQuery} em ${city}`;
};