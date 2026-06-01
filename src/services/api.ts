import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const api = {
  // 🔥 ATUALIZADO: Agora aceita o parâmetro dinâmico 'start' (Padrão 0 para a primeira busca)
  async searchLeads(query: string, city: string, user?: string, start: number = 0) {
    let url = `${BASE_URL}/leads?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&start=${start}`;
    
    if (user) {
      url += `&user=${encodeURIComponent(user)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao buscar os dados na API');
    }
    return response.json(); // Retorna o objeto { source, count, results, pagination }
  },

  // Busca os leads salvos no Funil do usuário
  async getFunilLeads(user: string) {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/funil?user=${encodeURIComponent(user)}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do funil');
    }
    return response.json();
  },

  // Salva um novo lead no Funil do usuário
  async saveLeadToFunil(leadId: string, user: string) {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/funil`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ leadId, user })
    });
    if (!response.ok) {
      throw new Error('Falha ao salvar o lead no banco de dados');
    }
    return response.json();
  },

  // Salva lead manual
  async saveManualLeadToFunil(leadData: any, user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/funil/manual`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...leadData, user })
    });
    
    if (!response.ok) throw new Error('Falha ao salvar o lead manual no banco');
    return response.json();
  },

  // Atualizado: Alinhado com o novo método PUT do backend (muda de bucket para bucketId)
  async updateLeadBucket(leadId: string, bucketId: string, user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/funil/move`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ leadId, bucketId, user })
    });
    
    if (!response.ok) throw new Error('Falha ao atualizar a coluna do lead no servidor');
    return response.json();
  },

  // Listar todas as colunas do usuário logado
  async getBuckets(user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets?user=${encodeURIComponent(user)}`, {
      headers
    });

    if (!response.ok) throw new Error('Erro ao carregar colunas do Kanban');
    return response.json();
  },

  // Criar uma nova coluna customizada
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

  // Editar o nome ou a ordem de uma coluna existente
  async updateBucket(id: string, name: string, order?: number) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/buckets`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, name, order })
    });

    if (!response.ok) throw new Error('Falha ao atualizar coluna');
    return response.json();
  },

  // Deletar uma coluna (o backend vai barrar se houver leads nela)
  async deleteBucket(id: string, user: string) {
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