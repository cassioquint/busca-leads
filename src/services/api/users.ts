import { BASE_URL } from './client';
import type { ExtendedUser } from '@/types';

export const userApi = {
  /**
   * Busca os dados complementares do usuário (plano e cotas) no banco de dados.
   * Exige o token JWT do Firebase para autenticação no middleware do backend.
   */
  async getProfile(token: string): Promise<Partial<ExtendedUser>> {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao obter os dados de perfil no banco de dados.');
    }

    return response.json();
  },
};