import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { LeadCard } from './LeadCard';
import type { Lead } from '../types';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface RadarViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  hasSearched: boolean;
  setHasSearched: (value: boolean) => void;
  onSaveLead: (id: string) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ 
  leads, 
  setLeads, 
  hasSearched, 
  setHasSearched, 
  onSaveLead 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'maps' | 'inauguracoes'>('maps');
  const [hideSavedLeads, setHideSavedLeads] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationParent] = useAutoAnimate();
  
  // 🔥 Puxamos o usuário logado
  const { user } = useAuth(); 

  const handleSearch = async (query: string, city: string) => {
    const cleanCity = city.split(' - ')[0].trim();
    
    if (!query || !cleanCity) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // 🔥 Passamos o e-mail do usuário como terceiro parâmetro para o backend cruzar os dados!
      const data = await api.searchLeads(query, cleanCity, user?.email);
      setLeads(data.results);
      
    } catch (err) {
      console.error("Erro na busca:", err);
      setError('Ocorreu um erro ao buscar os leads. Verifique se o backend está rodando na porta 3001.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (id: string) => {
    setLeads(currentLeads => 
      currentLeads.map(lead => 
        lead.id === id ? { ...lead, isSaved: true } : lead
      )
    );
    onSaveLead(id);
  };

  // O Filtro agora obedece a Aba e o Switch!
  const filteredLeads = leads.filter(lead => {
    const matchTab = activeSubTab === 'inauguracoes' ? !!lead.daysOpenText : !lead.daysOpenText;
    const matchSaved = hideSavedLeads ? !lead.isSaved : true;
    return matchTab && matchSaved;
  });

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Buscando leads no radar... Isso pode levar alguns segundos.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {!isLoading && !error && hasSearched && (
        <>
          <div className="pt-2 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeSubTab === 'maps' ? 'Estabelecimentos encontrados' : 'Negócios recém-abertos na sua região'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{filteredLeads.length} leads disponíveis · atualizado agora</p>
            </div>

            {/* O NOVO SWITCH */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-sm font-semibold text-slate-600 cursor-pointer" onClick={() => setHideSavedLeads(!hideSavedLeads)}>
                Ocultar leads salvos
              </span>
              <button
                onClick={() => setHideSavedLeads(!hideSavedLeads)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  hideSavedLeads ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hideSavedLeads ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-500 font-medium">Nenhum estabelecimento encontrado para este filtro.</p>
            </div>
          ) : (
            <div ref={animationParent} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onSave={handleSave}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};