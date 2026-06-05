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

  const handleManageTags = () => {
    if (!userEmail) return;
    const name = prompt("Deseja criar um novo rótulo customizado? Digite o nome:");
    if (!name || !name.trim()) return;

    const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    api.createTag(name.trim(), userEmail, randomColor)
      .then(newTag => setTags(prev => [...prev, newTag]))
      .catch(err => console.error("Erro ao gerenciar tags:", err));
  };

  return {
    handleCreateColumn,
    handleManageTags
  };
};