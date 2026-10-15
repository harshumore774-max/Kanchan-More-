import React from 'react';
import { MandiRate, Language } from '../types/grape';

interface MandiTickerProps {
  rates: MandiRate[];
  language: Language;
}

export const MandiTicker: React.FC<MandiTickerProps> = ({ rates, language }) => {
  return (
    <div className="bg-stone-950 border-b border-stone-800 text-stone-200 text-xs py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="font-semibold text-emerald-400">
            {language === 'mr' ? 'पिंपळगाव व नाशिक बाजारभाव' : 'Nashik & Pimpalgaon APMC Benchmark:'}
          </span>
          <span className="text-stone-400">
            {language === 'mr' ? 'आजचे सरासरी दर (प्रति किलो)' : 'Today\'s Weighted Average (₹/kg)'}
          </span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {rates.map((rate) => (
            <div key={rate.id} className="flex items-center gap-2 text-stone-300 whitespace-nowrap">
              <span className="text-stone-400">{rate.variety}:</span>
              <span className="font-semibold text-white font-mono tabular-nums">₹{rate.modalPrice}</span>
              <span
                className={`font-mono text-xs tabular-nums ${
                  rate.dailyChangePercent > 0
                    ? 'text-emerald-400'
                    : rate.dailyChangePercent < 0
                    ? 'text-rose-400'
                    : 'text-stone-400'
                }`}
              >
                {rate.dailyChangePercent > 0 ? `+${rate.dailyChangePercent}%` : `${rate.dailyChangePercent}%`}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-400 font-mono tabular-nums">{rate.arrivalsTodayTons} MT</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
