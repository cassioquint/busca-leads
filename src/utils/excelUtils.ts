import * as XLSX from 'xlsx';
import type { Lead, Tag } from '@/types';

interface Bucket {
  id: string;
  name: string;
}

export const exportLeadsToExcel = (leads: Lead[], buckets: Bucket[], tags: Tag[]) => {
  // 1. Mapeia e organiza as colunas que vão aparecer no Excel de forma amigável
  const dataToExport = leads.map((lead) => {
    // Encontra o nome da coluna/estágio atual no Kanban
    const currentColumn = buckets.find((b) => b.id === lead.bucketId);
    // Encontra o rótulo/tag atual
    const currentTag = tags.find((t) => t.id === lead.tagId);

    return {
      'Empresa / Nome': lead.name || 'Sem Nome',
      'Telefone': lead.phone || 'Sem Telefone',
      'Segmento / Tipo': lead.type || 'Não Definido',
      'Coluna no Funil': currentColumn ? currentColumn.name : 'Desconhecido',
      'Rótulo / Tag': currentTag ? currentTag.name : 'Nenhum',
      'Data de Follow-up': lead.followUpDate || 'Não Agendado',
      'Notas / Histórico': lead.notes || '',
    };
  });

  // 2. Cria uma nova planilha (Worksheet) a partir do array de objetos
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // 3. Define larguras automáticas para as colunas não virem espremidas
  const columnWidths = Object.keys(dataToExport[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 20), // Garante um tamanho mínimo de 20 caracteres por coluna
  }));
  worksheet['!cols'] = columnWidths;

  // 4. Cria o livro de trabalho (Workbook) e anexa a planilha
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads do Pipeline');

  // 5. Gera o arquivo binário e força o download no navegador
  const fileName = `export_leads_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};