import { api } from '@/services/api';
import type { Bucket, Tag } from '@/types';

interface UseCRMConfigProps {
  userEmail: string | null | undefined;
  buckets: Bucket[];
  setBuckets: React.Dispatch<React.SetStateAction<Bucket[]>>;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export const useCRMConfig = ({ userEmail, buckets, setBuckets, setTags }: UseCRMConfigProps) => {
  
  const handleCreateColumn = async (name: string) => {
    if (!userEmail || !name.trim()) return;

    try {
      const order = buckets.length + 1;
      const newBucket = await api.createBucket(name.trim(), userEmail, order);
      setBuckets(prev => [...prev, newBucket]);
    } catch (error) {
      console.error(error);
      alert("Não foi possível criar a coluna.");
    }
  };

  const handleRenameColumn = async (id: string, newName: string) => {
    if (!userEmail || !newName.trim()) return;
    try {
      await api.updateBucket(id, { name: newName.trim() });
      
      setBuckets(prev => 
        prev.map(bucket => bucket.id === id ? { ...bucket, name: newName.trim() } : bucket)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteColumn = async (id: string) => {
    if (!userEmail) return;
    try {
      await api.deleteBucket(id, userEmail);
      
      setBuckets(prev => prev.filter(bucket => bucket.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Mover coluna para a esquerda ou direita
  const handleMoveColumn = async (id: string, direction: 'left' | 'right') => {
    if (!userEmail) return;

    // Encontra o índice da coluna atual
    const currentIndex = buckets.findIndex(b => b.id === id);
    if (currentIndex === -1) return;

    // Calcula o novo índice alvo
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    // Trava se tentar ir para fora dos limites (ex: primeira coluna ir para a esquerda)
    if (targetIndex < 0 || targetIndex >= buckets.length) return;

    // Clona o array para fazer a troca (Swap) de posições
    const newBuckets = [...buckets];
    const [movedBucket] = newBuckets.splice(currentIndex, 1);
    newBuckets.splice(targetIndex, 0, movedBucket);

    // Re-calcula o campo 'order' sequencialmente de forma limpa (1, 2, 3...)
    const updatedBuckets = newBuckets.map((bucket, index) => ({
      ...bucket,
      order: index + 1
    }));

    // 1. Atualiza a UI imediatamente (Optimistic Update)
    setBuckets(updatedBuckets);

    try {
      // 2. Salva as novas ordens no banco de dados
      // Para ser performático, salvamos em lote apenas as duas que mudaram
      const bucketA = updatedBuckets[currentIndex];
      const bucketB = updatedBuckets[targetIndex];

      await Promise.all([
        api.updateBucket(bucketA.id, { order: bucketA.order }),
        api.updateBucket(bucketB.id, { order: bucketB.order })
      ]);
    } catch (error) {
      console.error("Erro ao salvar nova ordem das colunas:", error);
      alert("Não foi possível persistir a nova ordem no servidor.");
      // Se der erro, você pode opcionalmente reverter o estado passando o array 'buckets' antigo
    }
  };

  const handleCreateTag = async (name: string, color: string) => {
    if (!userEmail) return;
    try {
      const newTag = await api.createTag(name, userEmail, color);
      setTags(prev => [...prev, newTag]);
    } catch (error) {
      console.error("Erro ao criar tag:", error);
      alert("Não foi possível criar o rótulo.");
    }
  };

  const handleUpdateTag = async (id: string, name: string, color: string) => {
    try {
      await api.updateTag(id, name, color);
      setTags(prev => prev.map(t => t.id === id ? { ...t, name, color } : t));
    } catch (error) {
      console.error("Erro ao atualizar tag:", error);
      alert("Não foi possível atualizar o rótulo.");
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!userEmail) return;
    try {
      await api.deleteTag(id, userEmail);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tag:", error);
      alert("Não foi possível excluir o rótulo.");
    }
  };

  return {
    handleCreateColumn,
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveColumn,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag
  };
};