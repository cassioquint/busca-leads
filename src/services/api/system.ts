import { BASE_URL } from './client';

export const systemApi = {
  /**
   * Executa uma chamada leve de healthcheck para validar a conexão com o banco
   * e tirar o servidor do Render do modo de hibernação (cold start).
   */
  async getStatus(): Promise<{ status: string; database: string; timestamp: string }> {
    const response = await fetch(`${BASE_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Serviço temporariamente indisponível.');
    }

    return response.json();
  },
};