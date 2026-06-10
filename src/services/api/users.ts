import { BASE_URL } from './client';
import type { ExtendedUser } from '@/types';

export interface CheckoutPayload {
  // Dados do plano escolhido no frontend
  planKey: 'starter' | 'pro';
  billingType?: 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';

  // Dados cadastrais e fiscais do comprador
  name: string;
  cpfCnpj: string;
  mobilePhone: string;

  // Dados geográficos obrigatórios para a assinatura/NFS-e
  postalCode: string;
  address: string;
  addressNumber: string;
  province: string;
}

export interface PaymentResponse {
  url: string;
  message?: string;
}

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

  /**
   * Inicializa o checkout criando o cliente/assinatura no Asaas
   */
  async initializeCheckout(token: string, payload: CheckoutPayload): Promise<PaymentResponse> {
    const response = await fetch(`${BASE_URL}/payment/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao inicializar o checkout de faturamento.');
    }

    return response.json();
  },

  /**
   * Resgata o link direto do portal financeiro do Asaas para o cliente Pro
   */
  async getCustomerPortal(token: string): Promise<PaymentResponse> {
    const response = await fetch(`${BASE_URL}/payment/portal`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Não foi possível carregar o portal financeiro.');
    }

    return response.json();
  }
};