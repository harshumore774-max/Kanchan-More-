import React, { useState } from 'react';
import { GrapeLot, GrapeCategory, GrapeVariety, TalukaLocation, Language } from '../types/grape';
import { THOMPSON_IMAGE, WINE_CRUSH_IMAGE } from '../data/mockData';

interface NewLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLot: (lot: GrapeLot) => void;
  language: Language;
}

export const NewLotModal: React.FC<NewLotModalProps> = ({
  isOpen,
  onClose,
  onAddLot,
  language,
}) => {
  const [farmName, setFarmName] = useState('Godavari Gold Agro');
  const [farmerName, setFarmerName] = useState('Sachin Patil');
  const [phone, setPhone] = useState('+91 98220 44129');
  const [taluka, setTaluka] = useState<TalukaLocation>('Niphad');
  const [village, setVillage] = useState('Pimpalgaon Baswant');
  const [variety, setVariety] = useState<GrapeVariety>('Thompson Seedless');
  const [category, setCategory] = useState<GrapeCategory>('export');
  const [brix, setBrix] = useState<number>(19.5);
  const [acidityPercent, setAcidityPercent] = useState<number>(0.65);
  const [berrySizeMm, setBerrySizeMm] = useState<number>(19);
  const [totalQuantityTons, setTotalQuantityTons] = useState<number>(25);
  const [minOrderTons, setMinOrderTons] = useState<number>(5);
  const [pricePerKg, setPricePerKg] = useState<number>(88);
  const [harvestDate, setHarvestDate] = useState('2026-10-24');
  const [description, setDescription] = useState(
    'Prime Y-trellis plot with drip irrigation and biological crop protection. Uniform bunch architecture with crisp sweet berries.'
  );
  const [selectedCerts, setSelectedCerts] = useState<string[]>([
    'GlobalGAP',
    'MRL Residue Free',
  ]);

  if (!isOpen) return null;

  const toggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: GrapeLot = {
      id: `lot-nsk-${Date.now().toString().slice(-4)}`,
      farmerName,
      farmName,
      phone,
      taluka,
      village,
      variety,
      category,
      brix,
      acidityPercent,
      berrySizeMm,
      totalQuantityTons,
      availableQuantityTons: totalQuantityTons,
      minOrderTons,
      pricePerKg,
      harvestDate,
      certifications: selectedCerts.length > 0 ? selectedCerts : ['Standard Mandi Grade'],
      imageUrl: category === 'wine' ? WINE_CRUSH_IMAGE : THOMPSON_IMAGE,
      harvestStatus: 'ready',
      description,
      isVerified: true,
      labReportNumber: `NRCG-NSK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddLot(newLot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-mono">FARMER HARVEST LISTING</div>
            <h3 className="text-lg font-bold">
              {language === 'mr' ? 'नवीन द्राक्ष लॉट नोंदवा' : 'List New Grape Harvest Batch'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farmer / Owner Name</label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farm / Vineyard Block Name</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Taluka</label>
              <select
                value={taluka}
                onChange={(e: any) => setTaluka(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="Niphad">Niphad</option>
                <option value="Dindori">Dindori</option>
                <option value="Pimpalgaon Baswant">Pimpalgaon Baswant</option>
                <option value="Chandwad">Chandwad</option>
                <option value="Satana">Satana</option>
                <option value="Sinnar">Sinnar</option>
                <option value="Nashik">Nashik</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Village / Landmark</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Grape Cultivar / Variety</label>
              <select
                value={variety}
                onChange={(e: any) => setVariety(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="Thompson Seedless">Thompson Seedless</option>
                <option value="Super Sonaka">Super Sonaka</option>
                <option value="Sharad Seedless">Sharad Seedless</option>
                <option value="Red Globe">Red Globe</option>
                <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
                <option value="Chenin Blanc">Chenin Blanc</option>
                <option value="Shiraz">Shiraz</option>
                <option value="Sauvignon Blanc">Sauvignon Blanc</option>
                <option value="Manik Chaman">Manik Chaman</option>
                <option value="Jumbo Seedless">Jumbo Seedless</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category / End Use</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="export">Export Grade Table Grapes (APEDA)</option>
                <option value="wine">Winery Crush Grade (Brix 21°+)</option>
                <option value="domestic">Domestic Premium Table</option>
                <option value="raisin">Raisin / Bedana Processing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Sugar Brix (°Bx)</label>
              <input
                type="number"
                step="0.1"
                min="14"
                max="26"
                required
                value={brix}
                onChange={(e) => setBrix(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Berry Size (mm)</label>
              <input
                type="number"
                step="1"
                min="12"
                max="26"
                value={berrySizeMm}
                onChange={(e) => setBerrySizeMm(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Acidity (% TA)</label>
              <input
                type="number"
                step="0.05"
                min="0.4"
                max="1.2"
                value={acidityPercent}
                onChange={(e) => setAcidityPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Total Available (MT)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="500"
                required
                value={totalQuantityTons}
                onChange={(e) => setTotalQuantityTons(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Min Order MOQ (MT)</label>
              <input
                type="number"
                step="1"
                min="1"
                max={totalQuantityTons}
                required
                value={minOrderTons}
                onChange={(e) => setMinOrderTons(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Asking Rate (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                min="20"
                max="300"
                required
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Harvest Window Date</label>
            <input
              type="date"
              required
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Certifications & Clearance</label>
            <div className="flex flex-wrap gap-2">
              {['GlobalGAP', 'MRL Residue Free', 'Organic India', 'APEDA Grazing'].map((cert) => {
                const isSelected = selectedCerts.includes(cert);
                return (
                  <button
                    type="button"
                    key={cert}
                    onClick={() => toggleCert(cert)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-stone-50 border-stone-300 text-stone-600'
                    }`}
                  >
                    {isSelected ? `✓ ${cert}` : `+ ${cert}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description / Plot Conditions</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
            >
              Publish Grape Batch to Market
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
