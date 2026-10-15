import React, { useState, useMemo } from 'react';
import { GrapeLot, GrapeCategory, TalukaLocation, Language } from '../types/grape';

interface MarketplaceProps {
  lots: GrapeLot[];
  language: Language;
  onSelectLot: (lot: GrapeLot) => void;
  onOpenRFQ: (lot: GrapeLot) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  lots,
  language,
  onSelectLot,
  onOpenRFQ,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');
  const [selectedVariety, setSelectedVariety] = useState<string>('all');
  const [minBrix, setMinBrix] = useState<number>(14);

  // Filtered grape lots
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchSearch =
        lot.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.village.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'all' || lot.category === selectedCategory;
      const matchTaluka = selectedTaluka === 'all' || lot.taluka === selectedTaluka;
      const matchVariety = selectedVariety === 'all' || lot.variety === selectedVariety;
      const matchBrix = lot.brix >= minBrix;

      return matchSearch && matchCategory && matchTaluka && matchVariety && matchBrix;
    });
  }, [lots, searchTerm, selectedCategory, selectedTaluka, selectedVariety, minBrix]);

  const varietiesList = useMemo(() => {
    return Array.from(new Set(lots.map((l) => l.variety)));
  }, [lots]);

  const talukas: TalukaLocation[] = [
    'Niphad',
    'Dindori',
    'Pimpalgaon Baswant',
    'Chandwad',
    'Satana',
    'Sinnar',
    'Nashik',
  ];

  return (
    <section id="marketplace" className="py-14 bg-stone-50 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {language === 'mr' ? 'थेट शेतातून खरेदी' : 'Farm-Gate Harvest Lots'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {language === 'mr' ? 'सक्रिय द्राक्ष बाजारपेठ' : 'Nashik Grape Marketplace'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              {language === 'mr'
                ? 'ब्रिक्स साखर प्रमाण, बेरी आकार आणि एनआरसीजी प्रयोगशाळा तपासणी अहवालानुसार द्राक्ष लॉट निवडा.'
                : 'Select grape lots verified for sugar Brix, berry diameter, and residual pesticide clearance for wineries & export.'}
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            <span>
              {language === 'mr'
                ? `एकूण ${filteredLots.length} लॉट उपलब्ध`
                : `Showing ${filteredLots.length} of ${lots.length} active lots`}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'mr' ? 'शोध (जात, शेतकरी, गाव)' : 'Search (Variety, Farmer, Village)'}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'mr' ? 'उदा. Thompson, निफाड, पाटील...' : 'e.g. Thompson, Dindori, Sahyadri...'}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>

            {/* Purpose Category */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'mr' ? 'वापर व श्रेणी' : 'End Use / Purpose'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
                <option value="all">{language === 'mr' ? 'सर्व श्रेणी (All)' : 'All Purposes'}</option>
                <option value="export">{language === 'mr' ? 'निर्यात दर्जा (APEDA Export Grade)' : 'Export Table Grapes'}</option>
                <option value="wine">{language === 'mr' ? 'वाइन निर्मिती (Winery Crush 21°+)' : 'Winery Crush Batches'}</option>
                <option value="domestic">{language === 'mr' ? 'घरगुती प्रीमियम (Domestic Table)' : 'Domestic Premium'}</option>
                <option value="raisin">{language === 'mr' ? 'बेदाणा प्रक्रिया (Raisin Processing)' : 'Raisin / Bedana'}</option>
              </select>
            </div>

            {/* Taluka Belt */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'mr' ? 'तालुका / विभाग' : 'Vineyard Taluka'}
              </label>
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
                <option value="all">{language === 'mr' ? 'सर्व तालुके (All Talukas)' : 'All Talukas'}</option>
                {talukas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Variety */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {language === 'mr' ? 'द्राक्षाची जात' : 'Grape Variety'}
              </label>
              <select
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
                <option value="all">{language === 'mr' ? 'सर्व जाती' : 'All Varieties'}</option>
                {varietiesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Brix slider */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-stone-700">
                {language === 'mr' ? 'किमान साखर ब्रिक्स:' : 'Minimum Sugar Brix (°Bx):'}
              </span>
              <input
                type="range"
                min="14"
                max="24"
                step="0.5"
                value={minBrix}
                onChange={(e) => setMinBrix(parseFloat(e.target.value))}
                className="w-36 accent-emerald-700"
              />
              <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-xs tabular-nums">
                {minBrix}° Bx
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedTaluka('all');
                  setSelectedVariety('all');
                  setMinBrix(14);
                }}
                className="text-stone-500 hover:text-stone-900 underline font-medium"
              >
                {language === 'mr' ? 'फिल्टर रीसेट करा' : 'Reset Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid (3-column on desktop with consistent 4:3 imagery) */}
        {filteredLots.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <div className="text-3xl mb-3">🍇</div>
            <h3 className="text-base font-semibold text-stone-900 mb-1">
              {language === 'mr' ? 'लॉट आढळले नाहीत' : 'No matching grape lots found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              {language === 'mr'
                ? 'कृपया तुमचे फिल्टर निकष बदला किंवा ब्रिक्स मर्यादा कमी करा.'
                : 'Try adjusting your search filters or lowering the minimum Brix threshold.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedTaluka('all');
                setSelectedVariety('all');
                setMinBrix(14);
              }}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              {language === 'mr' ? 'सर्व लॉट दर्शवा' : 'Show All Lots'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Visual Asset (4:3) */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden group">
                  <img
                    src={lot.imageUrl}
                    alt={`${lot.variety} grapes grown by ${lot.farmerName} in ${lot.taluka}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-sm text-stone-200 px-2 py-0.5 rounded text-[11px] font-mono tabular-nums">
                    {lot.category === 'export' ? 'APEDA EXPORT' : lot.category === 'wine' ? 'WINERY CRUSH' : 'DOMESTIC TABLE'}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-stone-900 font-semibold px-2 py-0.5 rounded text-[11px] shadow-sm">
                    {lot.taluka}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metadata line (Zero-pill discipline with typographical separators) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span>{lot.farmName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lot.village}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{lot.harvestDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mb-1">{lot.variety}</h3>
                    <p className="text-xs text-stone-600 mb-4">
                      {language === 'mr' ? 'बागायतदार:' : 'Grower:'}{' '}
                      <strong className="text-stone-800">
                        {language === 'mr' && lot.farmerMarathiName ? lot.farmerMarathiName : lot.farmerName}
                      </strong>
                    </p>

                    {/* Technical Specs Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-lg border border-stone-100 mb-4 text-center">
                      <div>
                        <div className="text-[11px] text-stone-500">Sugar Brix</div>
                        <div className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                          {lot.brix}° Bx
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-stone-500">Available</div>
                        <div className="text-sm font-bold font-mono text-stone-800 tabular-nums">
                          {lot.availableQuantityTons} MT
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-stone-500">Asking Rate</div>
                        <div className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                          ₹{lot.pricePerKg}/kg
                        </div>
                      </div>
                    </div>

                    {/* Certifications text */}
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mb-4">
                      <span className="font-medium text-stone-700">Standards:</span>
                      <span>{lot.certifications.join(' · ')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => onSelectLot(lot)}
                      className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {language === 'mr' ? 'तपशील व अहवाल' : 'View Specs'}
                    </button>
                    <button
                      onClick={() => onOpenRFQ(lot)}
                      className="px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {language === 'mr' ? 'खरेदी प्रस्ताव पाठवा' : 'Send RFQ / Offer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
