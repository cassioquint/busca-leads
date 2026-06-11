import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  title: string;
  description: string;
  price: string;
  period: string;
  subtitle: string;
  aspect: string;
  icon: React.ReactNode;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  isCurrent?: boolean;
  isLoading?: boolean;
  onSelect: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  period,
  subtitle,
  aspect,
  icon,
  features,
  buttonText,
  isPopular = false,
  isCurrent = false,
  isLoading = false,
  onSelect,
}) => {
  return (
    <div 
      className={`bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-between relative transition-all hover:shadow-md ${
        isPopular 
          ? 'border-2 border-indigo-600 shadow-xl shadow-indigo-100/40 transform md:-translate-y-4 scale-[1.02] z-10' 
          : 'border-slate-200/80'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
          Mais Popular
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${isPopular ? 'text-indigo-600' : 'text-slate-500'}`}>
            {icon}
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{subtitle}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>

        <div className="pt-2">
          <div className="flex items-baseline text-slate-900">
            {price !== '0' && <span className="text-sm font-extrabold mr-0.5">R$</span>}
            <span className={`${price === '0' ? 'text-3xl' : 'text-4xl'} font-extrabold tracking-tight`}>
              {price === '0' ? 'R$ 0' : price}
            </span>
            <span className="ml-1 text-sm font-semibold text-slate-500">{period !== "" ? "/" + period : ""}</span>
          </div>
          <p className={`text-[11px] font-medium mt-1 ${isPopular ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
            { aspect }
          </p>
        </div>

        <ul className="space-y-3.5 border-t border-slate-100 pt-6">
          {features.map((feature, idx) => (
            <li 
              key={idx} 
              className={`flex items-start gap-2.5 text-sm ${
                feature.included ? 'text-slate-600' : 'text-slate-400 line-through'
              }`}
            >
              {feature.included ? (
                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-indigo-600' : 'text-emerald-500'}`} />
              ) : (
                <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              )}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8">
        <button
          type="button"
          disabled={isCurrent || isLoading}
          onClick={onSelect}
          className={`w-full font-bold text-sm py-3 rounded-xl transition-all flex justify-center items-center h-11 shadow-sm focus:outline-none ${
            isCurrent
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
              : isPopular
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.99] cursor-pointer'
              : 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 active:scale-[0.99] cursor-pointer'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <Loader2 className={`w-4 h-4 animate-spin ${isPopular ? 'text-white' : 'text-indigo-600'}`} />
          ) : isCurrent ? (
            'Plano Atual'
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
};