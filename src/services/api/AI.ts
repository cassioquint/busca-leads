import { BASE_URL, getAuthHeaders } from './client';
import type { AiConfigData } from '@/types';

/**
 * Função utilitária privada para tratar respostas de erro da API.
 */
async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorData: Record<string, unknown> = {};
  
  try {
    const jsonData = await response.json();
    if (jsonData && typeof jsonData === 'object') {
      errorData = jsonData as Record<string, unknown>;
    }
  } catch {
    // Caso o backend não retorne um JSON válido
  }

  if (response.status === 429 && typeof errorData.code === 'string') {
    throw new Error(errorData.code, { 
      cause: new Error(`HTTP 429: ${(errorData.error as string) || defaultMessage}`) 
    });
  }

  try {
    const customMessage = (errorData.error || errorData.message || defaultMessage) as string;
    throw new Error(customMessage);
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === 'FUNNEL_LIMIT' || err.message === 'SEARCHES_LIMIT')) {
      throw err;
    }
    throw new Error(defaultMessage, { cause: err });
  }
}

export const aiApi = {
  /**
   * 1. Finaliza o treinamento e clona a personalidade do vendedor.
   * Envia o array com as respostas do usuário para o backend extrair o System Prompt.
   */
  async trainPersona(user: string, vendorMessages: string[]) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/ai-config/train`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        userEmail: user, 
        vendorMessages 
      })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao treinar e clonar a persona da IA.');
    }
    
    return response.json();
  },

  /**
   * 2. Simula a resposta do cliente chato (Ator) durante a tela de treinamento.
   * O backend usa o Groq para gerar uma objeção baseada no serviço oferecido.
   */
  async simulateLeadReply(user: string, vendorMessage: string, serviceContext: string = 'este serviço') {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/ai-config/simulate-lead`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        userEmail: user, 
        vendorMessage,
        serviceContext
      })
    });

    if (!response.ok) {
      await handleApiError(response, 'Falha ao simular a resposta do lead.');
    }
    
    const data = await response.json();
    return data.reply;
  },

  // Salvar configurações da IA
  async saveAiConfig(user: string, configData: AiConfigData) {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${BASE_URL}/ai-config`, {
      method: 'PUT',
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
};