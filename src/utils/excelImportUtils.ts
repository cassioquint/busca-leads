import * as XLSX from 'xlsx';
import type { Lead } from '@/types';

// Interface para garantir a tipagem dos dados vindos da planilha
interface ExcelRow {
  'Empresa / Nome'?: string;
  'Telefone'?: string;
  'Segmento / Tipo'?: string;
  'Notas / Histórico'?: string;
}

// 🌟 FUNÇÃO AUXILIAR: Validação estrita contra letras e poluição de dados
const validateAndFormatImportedPhone = (phoneRaw?: string | number): string => {
  if (!phoneRaw) return 'Sem Telefone';
  
  const originalStr = phoneRaw.toString().trim();
  if (originalStr === '' || originalStr.toLowerCase() === 'sem telefone') return 'Sem Telefone';

  // 🕵️‍♂️ REGEX DEFENSIVO: Aceita apenas dígitos de 0 a 9, parênteses, hifens, sinal de + e espaços.
  // Qualquer letra de A-Z ou caractere fora dessa lista invalida o campo instantaneamente.
  const isValidPhonePattern = /^[0-9()+\-\s]+$/.test(originalStr);

  if (!isValidPhonePattern) {
    return 'Sem Telefone';
  }

  // Garante que, além dos símbolos válidos de formatação, exista algum número real
  const hasDigits = /\d/.test(originalStr);

  return hasDigits ? originalStr : 'Sem Telefone';
};

export const processExcelImport = (
  file: File,
  firstBucketId: string
): Promise<Partial<Lead>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Pega a primeira aba da planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converte para JSON usando as linhas de cabeçalho
        const rows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        if (rows.length === 0) {
          throw new Error('A planilha está vazia.');
        }

        // Validação defensiva do modelo: checa se pelo menos a coluna de Nome existe
        if (!('Empresa / Nome' in rows[0])) {
          throw new Error('Modelo inválido. Certifique-se de usar a planilha padrão com a coluna "Empresa / Nome".');
        }

        // Mapeia as linhas do Excel para o formato do Schema do nosso CRM
        const mappedLeads: Partial<Lead>[] = rows
          .filter(row => row['Empresa / Nome']?.toString().trim()) // Ignora linhas sem nome
          .map(row => ({
            title: row['Empresa / Nome']?.toString().trim() || '',
            phone: validateAndFormatImportedPhone(row['Telefone']), // 🌟 Proteção estrita aplicada aqui
            type: row['Segmento / Tipo']?.toString().trim() || 'Não Definido',
            notes: row['Notas / Histórico']?.toString().trim() || '',
            bucketId: firstBucketId, // Todo lead importado cai automaticamente na 1ª coluna
            isSaved: true
          }));

        resolve(mappedLeads);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler o arquivo físico.'));
    reader.readAsBinaryString(file);
  });
};

// Função para gerar e baixar a planilha modelo padrão
export const downloadTemplateExcel = () => {
  const templateData = [
    {
      'Empresa / Nome': 'Ex: Barbearia do João',
      'Telefone': '(51) 99999-9999',
      'Segmento / Tipo': 'Estética',
      'Notas / Histórico': 'Cliente interessado em automação de agendamentos.',
    },
    {
      'Empresa / Nome': 'Ex: Clínica Médica Silva',
      'Telefone': '(51) 3066-0000',
      'Segmento / Tipo': 'Saúde',
      'Notas / Histórico': 'Fazer contato na próxima segunda-feira à tarde.',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo de Importação');
  
  // Define larguras padrão para o modelo
  worksheet['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 45 }];

  XLSX.writeFile(workbook, 'modelo_importacao_leads.xlsx');
};