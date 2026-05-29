import React, { useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';

interface SearchBarProps {
  onSearch: (query: string, city: string) => void;
  activeSubTab: 'maps' | 'inauguracoes';
  setActiveSubTab: (tab: 'maps' | 'inauguracoes') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  activeSubTab,
  setActiveSubTab,
}) => {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, city);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      
      {/* FORMULÁRIO DE BUSCA */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        
        {/* INPUT: NICHO */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você procura? (Ex: Barbearia, Oficina, Clínica Estética)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* INPUT COMPONENTE: CIDADE COM AUTOCOMPLETE */}
        <CityAutocomplete value={city} onChange={setCity} />

        {/* BOTÃO PRINCIPAL DE TRIGGER */}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
        >
          <span>Buscar Leads</span>
        </button>
      </form>

      <div className="h-px bg-slate-100 w-full" />

      {/* SUB-ABAS DE ORIGEM DE DADOS */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setActiveSubTab('maps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
            activeSubTab === 'maps'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
              : 'bg-white border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Resultados do Google Maps</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inauguracoes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all relative ${
            activeSubTab === 'inauguracoes'
              ? 'bg-amber-50/60 border-amber-200 text-amber-700 shadow-sm'
              : 'bg-white border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Radar de Inaugurações (CNPJs Recém-Abertos)</span>
          <span className="flex h-5 w-9 items-center justify-center rounded-md bg-amber-500 text-[10px] font-extrabold text-white uppercase tracking-wider animate-pulse">
            Hot
          </span>
        </button>
      </div>
    </div>
  );
};