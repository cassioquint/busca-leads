import { BASE_URL, getAuthHeaders } from './client';

export const leadApi = {
  // Busca os leads salvos no Funil do usuário
  async getFunilLeads(user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil?user=${encodeURIComponent(user)}`, { headers });

    if (!response.ok) throw new Error('Erro ao carregar dados do funil');
    return response.json();
  },

  // Captura um prospect vindo do Radar e transforma em Lead no funil
  async captureProspect(prospectId: string, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prospectId, user }) // Atualizado de leadId para prospectId
    });
    if (!response.ok) throw new Error('Falha ao salvar o lead no banco de dados');
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

  // Atualiza a coluna (bucket) de um lead específico
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

  // Atualiza o rótulo (tag) de um lead específico
  async updateLeadTag(leadId: string, tagId: string | null, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil/tag`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ leadId, tagId, user })
    });

    if (!response.ok) throw new Error('Falha ao atualizar o rótulo do lead no servidor');
    return response.json();
  },

  // Editar as observações/notas do Lead
  async updateLeadNotes(id: string, notes: string, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ notes, user })
    });

    if (!response.ok) throw new Error('Falha ao atualizar as anotações do lead');
    return response.json();
  },

  // Excluir um Lead definitivamente do funil
  async deleteLead(id: string, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil/${id}?user=${encodeURIComponent(user)}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) throw new Error('Falha ao excluir o lead do servidor');
    return response.json();
  }
};
