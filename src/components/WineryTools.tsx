import React, { useState } from 'react';
import { Language } from '../types/grape';

interface WineryToolsProps {
  language: Language;
}

export const WineryTools: React.FC<WineryToolsProps> = ({ language }) => {
  // Enology calculator state
  const [variety, setVariety] = useState('Cabernet Sauvignon');
  const [brixInput, setBrixInput] = useState<number>(23.5);
  const [crushTons, setCrushTons] = useState<number>(10);
  const [targetAlcohol, setTargetAlcohol] = useState<number>(13.5);

  // Cold Chain export calculator state
  const [exportDestination, setExportDestination] = useState<'rotterdam' | 'dubai' | 'london'>('rotterdam');
  const [berrySize, setBerrySize] = useState<number>(19);
  const [preCoolHours, setPreCoolHours] = useState<number>(3);

  // Enology calculations
  // Standard conversion: 1 Brix yields ~0.57 - 0.58 % ABV in dry fermentation
  const estimatedAbv = (brixInput * 0.575).toFixed(1);
  const fermentableSugarsGl = (brixInput * 10.45).toFixed(0);
  const litersPerTon = variety.includes('Chenin') || variety.includes('Sauvignon Blanc') ? 710 : 680;
  const totalJuiceLiters = (crushTons * litersPerTon).toLocaleString('en-IN');
  const totalBottles = Math.floor((crushTons * litersPerTon) / 0.75).toLocaleString('en-IN');

  // Export shelf life calculations
  const transitDays = exportDestination === 'rotterdam' ? 24 : exportDestination === 'london' ? 22 : 5;
  const isColdChainOptimal = preCoolHours <= 4 && berrySize >= 18;

  return (
    <section id="winery-tools" className="py-14 bg-white border-b border-stone-200 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {language === 'mr' ? 'द्राक्ष गुणवत्ता व वाइन निर्मिती साधने' : 'Enology & APEDA Export Calculators'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            {language === 'mr' ? 'वाइनरी क्रश आणि निर्यात शेल्फ-लाइफ कॅल्क्युलेटर' : 'Winery Crush Yield & Export Shelf-Life Engine'}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {language === 'mr'
              ? 'ब्रिक्स साखर प्रमाणानुसार अपेक्षित वाइन अल्कोहोल (ABV), एकूण रस प्रमाण आणि आंतरराष्ट्रीय कंटेनर प्रवासातील सुरक्षितता मोजा.'
              : 'Calculate expected dry wine alcohol % ABV, press juice yield, and transit stability for APEDA reefer container shipments.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tool 1: Winemaker Crush & ABV Calculator */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>🍷</span>
                  <span>{language === 'mr' ? 'वाइन क्रश व अल्कोहोल अंदाज' : 'Wine Fermentation & Press Yield'}</span>
                </h3>
                <span className="text-xs font-mono text-stone-500">Nashik Wine Protocol</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {language === 'mr' ? 'वाइन द्राक्षाची जात:' : 'Grape Cultivar:'}
                  </label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Cabernet Sauvignon">Cabernet Sauvignon (Red, Dindori Terroir)</option>
                    <option value="Shiraz">Shiraz / Syrah (Red, Sanjegaon Terroir)</option>
                    <option value="Chenin Blanc">Chenin Blanc (White, Niphad Valley)</option>
                    <option value="Sauvignon Blanc">Sauvignon Blanc (White, High-Altitude Vani)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'mr' ? 'मोजलेले साखर प्रमाण (°Bx):' : 'Measured Sugar Brix (°Bx):'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="16"
                      max="28"
                      value={brixInput}
                      onChange={(e) => setBrixInput(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'mr' ? 'क्रश लॉट वजन (मेट्रिक टन):' : 'Crush Lot Volume (Metric Tons):'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      value={crushTons}
                      onChange={(e) => setCrushTons(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Calculation Output Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-200">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">Estimated Wine ABV</div>
                  <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
                    {estimatedAbv}%
                  </div>
                  <div className="text-[10px] text-stone-400">Potential Alcohol</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">Press Juice Volume</div>
                  <div className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    {totalJuiceLiters} L
                  </div>
                  <div className="text-[10px] text-stone-400">~{litersPerTon} L / ton yield</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-stone-500">750ml Bottles Yield</div>
                  <div className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    {totalBottles}
                  </div>
                  <div className="text-[10px] text-stone-400">Standard cellar cases</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-500 leading-normal">
              Sugar conversion based on standard <em>Saccharomyces cerevisiae</em> commercial wine yeast strain yield at 22°C temperature-controlled stainless steel tank fermentation.
            </div>
          </div>

          {/* Tool 2: APEDA Fresh Export Cold-Chain Transit Safety Index */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>🚢</span>
                  <span>{language === 'mr' ? 'अपेडा निर्यात शीत साखळी व शेल्फ-लाइफ' : 'APEDA Export Cold-Chain Transit Safety'}</span>
                </h3>
                <span className="text-xs font-mono text-stone-500">EU & Gulf Standards</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {language === 'mr' ? 'निर्यात गंतव्य स्थान (Export Port):' : 'Export Destination Port:'}
                  </label>
                  <select
                    value={exportDestination}
                    onChange={(e: any) => setExportDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="rotterdam">Rotterdam Port, Netherlands (24 Days Sea Reefer)</option>
                    <option value="london">London Gateway, United Kingdom (22 Days Sea Reefer)</option>
                    <option value="dubai">Jebel Ali Port, Dubai UAE (5 Days Sea Reefer)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'mr' ? 'बेरी व्यास (Berry Size mm):' : 'Berry Diameter (mm):'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="14"
                      max="26"
                      value={berrySize}
                      onChange={(e) => setBerrySize(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {language === 'mr' ? 'हार्वेस्ट नंतर प्री-कूलिंग वेळ (तास):' : 'Pre-Cooling Dwell (Hours):'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="12"
                      value={preCoolHours}
                      onChange={(e) => setPreCoolHours(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Transit Safety Metric */}
              <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <div className="text-[11px] text-stone-500">Transit Duration</div>
                    <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
                      {transitDays} Days Reefer
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500">Container Temperature</div>
                    <div className="text-base font-bold font-mono text-emerald-800 tabular-nums">
                      0.0°C to 0.5°C
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-stone-500">Shelf-Life Status</div>
                    <div className={`text-sm font-bold ${isColdChainOptimal ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isColdChainOptimal ? 'Optimal Freshness' : 'Borderline Risk'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-100 rounded-lg text-[11px] text-stone-600 space-y-1">
                  <div><strong>SO₂ Pad Requirement:</strong> 1 Dual-release generator sheet per 5kg export carton.</div>
                  <div><strong>Relative Humidity:</strong> 90% - 95% maintained throughout transit via JNPT Port.</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-500 leading-normal">
              Complies with APEDA Guidelines for Export of Fresh Grapes from India to European Union and GCC member nations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
