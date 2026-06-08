import { BASE_URL } from './client';
import { auth } from '@/services/firebase';

export const prospectApi = {
  // Busca os prospects crus do Google Maps através do Radar
  async searchProspects(query: string, city: string, _user?: string, start: number = 0) {
    // 1. Captura o utilizador atual logado no Firebase
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Utilizador não autenticado no sistema.');
    }

    // 2. Gera/Renova o Token JWT de forma assíncrona
    const token = await currentUser.getIdToken();

    // 3. Monta a URL limpa (sem vazar o e-mail na query string)
    const url = `${BASE_URL}/leads?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&start=${start}`;

    // 4. Dispara a requisição injetando o cabeçalho de Autorização seguro
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // 5. Tratamento de erros detalhado para o plano de negócios
    if (!response.ok) {  
      if (response.status === 403) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar prospects na API.');
      }

      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Limite de buscas atingido.');
      }

      throw new Error('Falha ao buscar os prospects na API');
    }

    return response.json();
  }
};