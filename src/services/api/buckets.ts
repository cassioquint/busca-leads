import { BASE_URL, getAuthHeaders } from './client';

// Interface para permitir atualizações parciais no PUT de forma tipada
interface UpdateBucketData {
  name?: string;
  order?: number;
}

export const bucketApi = {
  async getBuckets(user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets?user=${encodeURIComponent(user)}`, { headers });
    if (!response.ok) throw new Error('Erro ao carregar colunas do Kanban');
    return response.json();
  },

  async createBucket(name: string, user: string, order?: number) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, user, order })
    });
    if (!response.ok) throw new Error('Falha ao criar nova coluna');
    return response.json();
  },

  async updateBucket(id: string, data: UpdateBucketData) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, ...data })
    });
    if (!response.ok) throw new Error('Falha ao atualizar coluna');
    return response.json();
  },

  async deleteBucket(id: string, user?: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id, user })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao deletar coluna');
    }
    return response.json();
  }
};