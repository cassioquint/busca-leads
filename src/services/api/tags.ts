import { BASE_URL, getAuthHeaders } from './client';

export const tagApi = {
  async getTags(user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/tags?user=${encodeURIComponent(user)}`, { headers });
    if (!response.ok) throw new Error('Erro ao carregar rótulos do Kanban');
    return response.json();
  },

  async createTag(name: string, user: string, color: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, user, color })
    });
    if (!response.ok) throw new Error('Falha ao criar novo rótulo');
    return response.json();
  },

  async updateTag(id: string, name: string, color: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/tags`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, name, color })
    });
    if (!response.ok) throw new Error('Falha ao atualizar rótulo');
    return response.json();
  },

  async deleteTag(id: string, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/tags`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id, user })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao deletar rótulo');
    }
    return response.json();
  }
};
