import React, { useState } from 'react';
import { GrapeLot, Inquiry, Language, UserRole } from '../types/grape';

interface LotDetailModalProps {
  lot: GrapeLot | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  activeRole: UserRole;
  language: Language;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  isOpen,
  onClose,
  onSubmitInquiry,
  activeRole,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'rfq'>('specs');
  
  // RFQ Form state
  const [buyerName, setBuyerName] = useState(
    activeRole === 'winery'
      ? 'Dr. Alok Sen (Chief Winemaker)'
      : activeRole === 'exporter'
      ? 'Vikramaditya Roy (Export Director)'
      : 'Sunil Mehta'
  );
  const [companyName, setCompanyName] = useState(
    activeRole === 'winery'
      ? 'Nashik Valley Heritage Winery'
      : activeRole === 'exporter'
      ? 'EuroFresh Agri Logistics BV'
      : 'Mehta Fresh Agri Exports'
  );
  const [buyerPhone, setBuyerPhone] = useState('+91 98200 91823');
  const [buyerEmail, setBuyerEmail] = useState('procure@nashikagro.com');
  const [requestedTons, setRequestedTons] = useState<number>(lot?.minOrderTons || 5);
  const [offeredRate, setOfferedRate] = useState<number>(lot?.pricePerKg || 85);
  const [deliveryTerms, setDeliveryTerms] = useState<'Farm-gate Pickup' | 'Cold Storage Delivery' | 'Ex-Packhouse'>(
    'Farm-gate Pickup'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !lot) return null;

  // Total valuation calculation
  const totalValuation = requestedTons * 1000 * offeredRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInquiry({
      lotId: lot.id,
      lotVariety: lot.variety,
      farmName: lot.farmName,
      farmerName: lot.farmerName,
      buyerType: activeRole === 'winery' ? 'winery' : activeRole === 'farmer' ? 'retailer' : 'exporter',
      buyerName,
      companyName,
      buyerPhone,
      buyerEmail,
      requestedQuantityTons: requestedTons,
      offeredRatePerKg: offeredRate,
      askingRatePerKg: lot.pricePerKg,
      deliveryTerms,
      notes: notes || `Direct procurement quotation for ${requestedTons} MT of ${lot.variety}.`,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-mono">
              LOT ID: {lot.id} · {lot.taluka.toUpperCase()}
            </div>
            <h3 className="text-lg font-bold">{lot.variety} — {lot.farmName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Controls (Segmented clean control) */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {language === 'mr' ? 'तांत्रिक तपासणी व प्रयोगशाळा अहवाल' : 'Quality Specs & Lab Certificate'}
          </button>
          <button
            onClick={() => setActiveTab('rfq')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rfq'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {language === 'mr' ? 'खरेदी प्रस्ताव सादर करा (RFQ Proposal)' : 'Submit Purchase Offer (RFQ)'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-1">
                {language === 'mr' ? 'खरेदी प्रस्ताव यशस्वीरित्या पाठवला!' : 'Quotation Proposal Submitted!'}
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                {language === 'mr'
                  ? `${lot.farmerName} यांच्या डॅशबोर्डवर तुमचा प्रस्ताव पाठवण्यात आला आहे.`
                  : `Your offer has been routed directly to ${lot.farmerName}. You can track responses in the dashboard.`}
              </p>
            </div>
          ) : activeTab === 'specs' ? (
            <div className="space-y-6">
              {/* Media banner */}
              <div className="relative rounded-xl overflow-hidden h-48 bg-stone-100">
                <img
                  src={lot.imageUrl}
                  alt={lot.variety}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-sm text-stone-200 text-xs px-2.5 py-1 rounded">
                  {lot.village}, Taluka {lot.taluka}, Nashik
                </div>
              </div>

              {/* Lab Parameters Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  {language === 'mr' ? 'एनआरसीजी / अपेडा मान्यताप्राप्त गुणवत्ता निर्देशक' : 'Physical & Chemical Analysis Parameters'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div className="text-[11px] text-stone-500">Sugar Content</div>
                    <div className="text-base font-bold font-mono text-emerald-800 tabular-nums">{lot.brix}° Brix</div>
                    <div className="text-[10px] text-stone-400">Refractometer calibrated</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div className="text-[11px] text-stone-500">Titratable Acidity</div>
                    <div className="text-base font-bold font-mono text-stone-800 tabular-nums">{lot.acidityPercent}% TA</div>
                    <div className="text-[10px] text-stone-400">Tartaric equivalent</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div className="text-[11px] text-stone-500">Berry Diameter</div>
                    <div className="text-base font-bold font-mono text-stone-800 tabular-nums">{lot.berrySizeMm || 18} mm</div>
                    <div className="text-[10px] text-stone-400">Digital caliper reading</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div className="text-[11px] text-stone-500">MRL Status</div>
                    <div className="text-base font-bold font-mono text-emerald-700 tabular-nums">Passed</div>
                    <div className="text-[10px] text-stone-400">180 EU residues clear</div>
                  </div>
                </div>
              </div>

              {/* Harvest details */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Total Lot Volume:</span>
                  <span className="font-semibold text-stone-900 font-mono tabular-nums">{lot.totalQuantityTons} Metric Tons</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Currently Unsold:</span>
                  <span className="font-semibold text-stone-900 font-mono tabular-nums">{lot.availableQuantityTons} Metric Tons</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Minimum Order Quantity (MOQ):</span>
                  <span className="font-semibold text-stone-900 font-mono tabular-nums">{lot.minOrderTons} Metric Tons</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Farmer Asking Rate:</span>
                  <span className="font-bold text-emerald-800 font-mono tabular-nums">₹{lot.pricePerKg} / kg (₹{lot.pricePerKg * 1000}/MT)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Target Harvest Window:</span>
                  <span className="font-semibold text-stone-900 font-mono tabular-nums">{lot.harvestDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Lab Analysis Reference:</span>
                  <span className="font-mono text-stone-700">{lot.labReportNumber}</span>
                </div>
              </div>

              {/* Agronomic notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  {language === 'mr' ? 'बागेचा तपशील व व्यवस्थापन' : 'Viticulturist Agronomic Notes'}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
                  {lot.description}
                </p>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rfq')}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  {language === 'mr' ? 'प्रस्ताव पाठवा →' : 'Negotiate / Send RFQ →'}
                </button>
              </div>
            </div>
          ) : (
            /* RFQ Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                <strong>RFQ Offer for:</strong> {lot.variety} from {lot.farmName} · Farmer Asking: ₹{lot.pricePerKg}/kg
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Buyer / Officer Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Company / Winery / Exporter</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Requested Quantity (Metric Tons)
                  </label>
                  <input
                    type="number"
                    min={lot.minOrderTons}
                    max={lot.availableQuantityTons}
                    step="0.5"
                    required
                    value={requestedTons}
                    onChange={(e) => setRequestedTons(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                  <span className="text-[10px] text-stone-500">Max available: {lot.availableQuantityTons} MT</span>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Offered Rate (₹/kg)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    step="0.5"
                    required
                    value={offeredRate}
                    onChange={(e) => setOfferedRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                  />
                  <span className="text-[10px] text-stone-500">Farmer asking: ₹{lot.pricePerKg}/kg</span>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-stone-700 mb-1">Delivery / Logistics Protocol</label>
                <select
                  value={deliveryTerms}
                  onChange={(e: any) => setDeliveryTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Farm-gate Pickup">Farm-gate Pickup (Buyer brings crates / tanker to vineyard)</option>
                  <option value="Cold Storage Delivery">Cold Storage Delivery (Delivered pre-cooled to Pimpalgaon / Nashik warehouse)</option>
                  <option value="Ex-Packhouse">Ex-Packhouse (Graded, sorted and carton-packed for sea/air shipping)</option>
                </select>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-stone-700 mb-1">Special Instructions & Quality Conditions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. MRL test re-verification, pre-harvest water cut-off date, specific harvest morning temperature..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Deal Summary Box */}
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500">Estimated Contract Value:</span>
                  <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
                    ₹{totalValuation.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-500">
                  <span>{requestedTons} MT ({requestedTons * 1000} kg)</span>
                  <div>@ ₹{offeredRate}/kg</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Back to Specs
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
                >
                  Submit Official RFQ Proposal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
