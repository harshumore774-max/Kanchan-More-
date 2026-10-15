import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { Language } from '../types/grape';

interface HeroProps {
  language: Language;
  onExploreClick: () => void;
  onPostBatchClick: () => void;
  onViewTemplateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExploreClick,
  onPostBatchClick,
  onViewTemplateClick,
}) => {
  return (
    <section className="relative bg-stone-900 text-stone-100 overflow-hidden border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context, Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              {language === 'mr'
                ? 'भारताची द्राक्ष व वाइन राजधानी · नाशिक, महाराष्ट्र'
                : 'India’s Grape & Wine Valley · Nashik Agro Belt'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              {language === 'mr'
                ? 'द्राक्ष बागायतदार, वाइनरी आणि थेट निर्यातदारांचे विश्वासू व्यासपीठ'
                : 'Direct Grape Sourcing from Nashik’s Premier Vineyards'}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              {language === 'mr'
                ? 'निफाड, दिंडोरी, पिंपळगाव बसवंत आणि चांदवड परिसरातील शेतकऱ्यांना थेट वाइन निर्माते व आंतरराष्ट्रीय निर्यातदारांशी जोडणारे पारदर्शक व्यासपीठ. मध्यस्थांशिवाय योग्य भाव, अचूक ब्रिक्स तपासणी आणि जलद व्यवहार.'
                : 'Connecting 12,000+ viticulturists from Niphad, Dindori, and Pimpalgaon directly with commercial wineries and APEDA-certified global fruit exporters. Zero middlemen markups, guaranteed Brix traceability, and farm-gate contracts.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
              >
                {language === 'mr' ? 'उपलब्ध द्राक्ष लॉट पहा' : 'Browse Harvest Batches'}
              </button>

              <button
                onClick={onPostBatchClick}
                className="px-5 py-3 text-sm font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
              >
                {language === 'mr' ? 'नवीन द्राक्ष लॉट नोंदवा' : 'List Harvest Batch'}
              </button>

              <button
                onClick={onViewTemplateClick}
                className="px-4 py-3 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {language === 'mr' ? 'वेबसाईट कोड व ZIP टेम्पलेट →' : 'VS Code Template & ZIP →'}
              </button>
            </div>

            {/* Adjacency Proof Strip (Clean tabular stats without pill enclosures) */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-800/80">
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">85%</div>
                <div className="text-xs text-stone-400">
                  {language === 'mr' ? 'भारतातील एकूण द्राक्ष निर्यात' : 'India\'s Grape Export Share'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">42+</div>
                <div className="text-xs text-stone-400">
                  {language === 'mr' ? 'नोंदणीकृत वाइनरी व ब्रँड्स' : 'Partner Wineries & Cellars'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">₹0</div>
                <div className="text-xs text-stone-400">
                  {language === 'mr' ? 'दलाल व मध्यस्थ कमिशन' : 'Middleman Agent Surcharge'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-800">
              <img
                src={HERO_IMAGE}
                alt="Nashik grape vineyards in Dindori and Niphad valley"
                referrerPolicy="no-referrer"
                className="w-full h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-xs text-stone-300">
                  <div className="font-semibold text-white">Dindori & Niphad Valley, Maharashtra</div>
                  <div>Harvest Season 2026-2027 · GlobalGAP Certified Plots</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
