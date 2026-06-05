import React, { useState } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import { CityAutocomplete } from '@/components/common/CityAutocomplete';

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
    <div className="w-full space-y-4">

      {/* SUB-ABAS DE ORIGEM DE DADOS */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('maps')}
          className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            activeSubTab === 'maps'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Google Maps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('inauguracoes')}
          className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            activeSubTab === 'inauguracoes'
              ? 'bg-white text-amber-700 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Inaugurações</span>
          <span className="flex h-3.5 w-6 items-center justify-center rounded bg-amber-500 text-[8px] font-black text-white uppercase tracking-wider scale-90">
            Hot
          </span>
        </button>
      </div>

      {/* FORMULÁRIO DE BUSCA */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

        {/* INPUT: NICHO */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que procura? (Ex: Oficina, Estética)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* INPUT COMPONENTE: CIDADE COM AUTOCOMPLETE */}
        <div className="w-full">
          <CityAutocomplete value={city} onChange={setCity} />
        </div>

        {/* BOTÃO PRINCIPAL DE TRIGGER */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Buscar Leads no Radar</span>
        </button>
      </form>
    </div>
  );
};