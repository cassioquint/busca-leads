import { auth } from './firebase';

const BASE_URL = 'http://localhost:3001/api';

// Função auxiliar para pegar o token do usuário logado
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const api = {
  // Busca leads no Radar (Banco Neon ou SerpApi)
  // 🔥 NOVO: Adicionado parâmetro de usuário para o backend cruzar com o funil
  async searchLeads(query: string, city: string, user?: string) {
    let url = `${BASE_URL}/leads?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`;
    
    // Se tiver usuário logado, manda pra API saber de quem é o funil
    if (user) {
      url += `&user=${encodeURIComponent(user)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao buscar os dados na API');
    }
    return response.json();
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
    return response.json(); // Retorna o lead formatadinho com o ID real do banco
  },

  // 🔥 NOVO: Atualiza a coluna do Kanban
  async updateLeadBucket(leadId: string, bucket: string, user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/funil/move`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ leadId, bucket, user })
    });
    
    if (!response.ok) throw new Error('Falha ao atualizar a coluna do lead no servidor');
    return response.json();
  }
};