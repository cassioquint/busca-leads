import { BASE_URL, getAuthHeaders } from './client';
import type { Lead, AiConfigData } from '@/types';

/**
 * Função utilitária privada para tratar respostas de erro da API.
 * Evita repetição de código (DRY) ao extrair enums estruturados do backend.
 */
async function handleApiError(response: Response, defaultMessage: string): Promise<never> {

  let errorData: Record<string, unknown> = {};
  
  // 1. Tenta extrair o JSON de erro do backend com segurança
  try {
    const jsonData = await response.json();
    if (jsonData && typeof jsonData === 'object') {
      errorData = jsonData as Record<string, unknown>;
    }
  } catch {
    // Caso o backend não retorne um JSON válido (ex: queda de servidor)
  }

  // 2. Valida se é um estouro de cota (429) com nosso código enum cadastrado
  if (response.status === 429 && typeof errorData.code === 'string') {
    // Criamos um erro sintomático passando a causa original contextualmente
    throw new Error(errorData.code, { 
      cause: new Error(`HTTP 429: ${(errorData.error as string) || defaultMessage}`) 
    });
  }

  // 3. Bloco catch geral para unificar e preservar o rastreamento (stack trace)
  try {
    const customMessage = (errorData.error || errorData.message || defaultMessage) as string;
    throw new Error(customMessage);
  } catch (err: unknown) {
    // Regra do ESLint: Se já for um dos nossos Enums mapeados acima, propaga direto
    if (err instanceof Error && (err.message === 'FUNNEL_LIMIT' || err.message === 'SEARCHES_LIMIT')) {
      throw err;
    }
    
    // Solução Definitiva: Anexa o 'err' pego no catch dentro da propriedade 'cause'
    throw new Error(defaultMessage, { cause: err });
  }
}

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
      body: JSON.stringify({ prospectId, user })
    });
    
    if (!response.ok) {
      await handleApiError(response, 'Falha ao salvar o lead no banco de dados');
    }
    return response.json();
  },

  // Salva lead manual
  async saveManualLeadToFunil(leadData: Omit<Lead, 'id' | 'userEmail' | 'isSaved' | 'bucketId'>, user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil/manual`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...leadData, user })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao salvar o lead manual no banco');
    }
    return response.json();
  },

  // Importação de Leads em Lote (Bulk Insert) via Planilha
  async importLeadsBulk(leads: Partial<Lead>[], user: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/funil/bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ leads, user })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao realizar a importação em lote no servidor');
    }
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
  async updateLeadNotes(id: string, payload: { notes?: string; phone?: string; aiPitch?: string }, user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/funil/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ 
        notes: payload.notes,
        phone: payload.phone,
        aiPitch: payload.aiPitch,
        user 
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar as informações do lead');
    }
    
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
  },

  // Gerar abordagem de vendas com IA (Groq)
  async generateAIPitch(id: string, user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/leads/${id}/pitch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao gerar abordagem com a IA');
    }
    
    const data = await response.json();
    return data.pitch;
  },

  getLeadInteractions: async (id: string) => {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/leads/${id}/interactions`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error('Falha ao buscar o histórico.');
    return await response.json();
  },

  // Salvar configurações da IA
  async saveAiConfig(user: string, configData: AiConfigData) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/ai-config`, {
      method: 'PUT', // ou POST, dependendo de como você criar a rota no backend
      headers,
      body: JSON.stringify({ 
        userEmail: user, 
        ...configData 
      })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao salvar as configurações da IA no servidor');
    }
    
    return response.json();
  },

  // Buscar configurações da IA do usuário
  async getAiConfig(user: string) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/ai-config?user=${encodeURIComponent(user)}`, {
      headers
    });

    if (!response.ok) {
      // Se não encontrar (404), podemos retornar null para o frontend saber que está vazio
      if (response.status === 404) return null;
      await handleApiError(response, 'Falha ao carregar as configurações da IA');
    }
    
    return response.json();
  },

  // Gerar tréplica com IA
  async generateLeadReply(id: string, lastMessageSent: string, clientResponse: string, user: string) {
    const headers = await getAuthHeaders();
    console.log(clientResponse)
    
    const response = await fetch(`${BASE_URL}/leads/${id}/reply`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        lastMessageSent, 
        clientResponse, 
        user 
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao conectar com o gerador de tréplica.');
    }

    const data = await response.json();
    return data.reply;
  }
};