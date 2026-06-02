import { BASE_URL } from './client';

export const prospectApi = {
  // Busca os prospects crus do Google Maps através do Radar
  async searchProspects(query: string, city: string, user?: string, start: number = 0) {
    let url = `${BASE_URL}/leads?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&start=${start}`;

    if (user) {
      url += `&user=${encodeURIComponent(user)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao buscar os prospects na API');
    }
    return response.json();
  }
};
