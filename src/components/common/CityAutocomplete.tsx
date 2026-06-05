import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ value, onChange }) => {
  const [allCities, setAllCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await response.json();

        const formatted = data.map((c: any) => {
          const uf = c?.microrregiao?.mesorregiao?.UF?.sigla;
          return uf ? `${c.nome} - ${uf}` : c.nome;
        });

        setAllCities(formatted);
      } catch (error) {
        console.error("Erro ao carregar cidades do IBGE:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    onChange(userInput);
    setHighlightedIndex(-1);

    if (userInput.length > 1) {
      const filtered = allCities.filter(c =>
        c.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectCity = (selectedCity: string) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    onChange(selectedCity);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredCities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = highlightedIndex < filteredCities.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(nextIndex);
      onChange(filteredCities[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredCities.length - 1;
      setHighlightedIndex(prevIndex);
      onChange(filteredCities[prevIndex]);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectCity(filteredCities[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);

      if (value.length > 0) {
        const exactMatch = allCities.find(c => c.toLowerCase() === value.toLowerCase());
        const fuzzyMatch = allCities.find(c => c.toLowerCase().includes(value.toLowerCase()));

        if (!exactMatch && fuzzyMatch) {
          onChange(fuzzyMatch);
        }
      }
    }, 200);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
      <input
        type="text"
        value={value}
        onChange={handleCityChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => value.length > 1 && setShowDropdown(true)}
        placeholder="Ex: Novo Hamburgo, Estância Velha"
        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all relative z-0"
        autoComplete="off"
      />

      {/* Dropdown Flutuante Ajustado */}
      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
          {filteredCities.map((suggestion, index) => (
            <li
              key={index}
              onMouseDown={(e) => {
                // Previne o blur do input de disparar antes do clique ser registrado
                e.preventDefault(); 
                handleSelectCity(suggestion);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3.5 py-2 text-xs cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
                highlightedIndex === index
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};