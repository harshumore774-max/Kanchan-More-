import React, { useState } from 'react';
import { GrapeLot, Inquiry, Language, UserRole } from '../types/grape';

interface FarmerDashboardProps {
  lots: GrapeLot[];
  inquiries: Inquiry[];
  activeRole: UserRole;
  language: Language;
  onOpenNewLotModal: () => void;
  onUpdateInquiryStatus: (inquiryId: string, newStatus: 'accepted' | 'countered' | 'declined', counterRate?: number) => void;
  onToggleLotStatus: (lotId: string) => void;
  onSelectLot: (lot: GrapeLot) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  lots,
  inquiries,
  activeRole,
  language,
  onOpenNewLotModal,
  onUpdateInquiryStatus,
  onToggleLotStatus,
  onSelectLot,
}) => {
  const [selectedGatePassLot, setSelectedGatePassLot] = useState<GrapeLot | null>(null);
  const [counterInputId, setCounterInputId] = useState<string | null>(null);
  const [counterRateValue, setCounterRateValue] = useState<number>(90);

  // Filter lots belonging to demo farmer or all if viewing
  const farmerLots = lots;

  const handleSendCounter = (inquiryId: string) => {
    onUpdateInquiryStatus(inquiryId, 'countered', counterRateValue);
    setCounterInputId(null);
  };

  return (
    <section id="dashboard" className="py-14 bg-stone-100/70 border-b border-stone-200 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Mode Information */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {activeRole === 'farmer'
                ? language === 'mr' ? 'शेतकरी नियंत्रण कक्ष' : 'Viticulturist Command Center'
                : language === 'mr' ? 'खरेदीदार कक्ष' : 'Procurement & Contract Portal'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {activeRole === 'farmer'
                ? language === 'mr' ? 'माझे द्राक्ष लॉट आणि खरेदीदारांचे प्रस्ताव' : 'Farmer Batch & Quotation Management'
                : language === 'mr' ? 'वाइनरी व निर्यातदार करार कक्ष' : 'Winery & Exporter Contract Tracker'}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {activeRole === 'farmer'
                ? 'तुमच्या बागेतील द्राक्ष लॉट व्यवस्थापित करा, वाइनरी व निर्यातदारांकडून आलेल्या ऑफर्स स्वीकारा किंवा प्रति-दर पाठवा.'
                : 'Track submitted purchase quotations, manage farm-gate inspection appointments, and close contracts.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeRole === 'farmer' && (
              <button
                onClick={onOpenNewLotModal}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{language === 'mr' ? 'नवीन द्राक्ष लॉट नोंदवा' : 'Post New Harvest Batch'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Farmer View: My Batches Table */}
        {activeRole === 'farmer' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {language === 'mr' ? 'तुमचे सक्रिय द्राक्ष लॉट्स' : 'My Listed Harvest Batches'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'mr' ? 'थेट खरेदीदारांना दिसणारे लॉट' : 'Currently visible to wineries and exporters'}
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500 tabular-nums">
                {farmerLots.length} {language === 'mr' ? 'लॉट' : 'Lots'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-3">Variety & Farm</th>
                    <th className="px-4 py-3">Brix & Quality</th>
                    <th className="px-4 py-3">Available / Total</th>
                    <th className="px-4 py-3">Asking Rate</th>
                    <th className="px-4 py-3">Harvest Date</th>
                    <th className="px-4 py-3">APEDA / Lab Pass</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {farmerLots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900 text-sm">{lot.variety}</div>
                        <div className="text-stone-500 text-[11px]">{lot.farmName} · {lot.taluka}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono font-bold text-emerald-800 text-xs tabular-nums">
                          {lot.brix}° Bx
                        </div>
                        <div className="text-stone-500 text-[11px]">{lot.berrySizeMm || 18} mm · {lot.acidityPercent}% TA</div>
                      </td>
                      <td className="px-4 py-4 font-mono tabular-nums">
                        <span className="font-semibold text-stone-900">{lot.availableQuantityTons} MT</span>
                        <span className="text-stone-400"> / {lot.totalQuantityTons} MT</span>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-stone-900 text-xs tabular-nums">
                        ₹{lot.pricePerKg}/kg
                      </td>
                      <td className="px-4 py-4 font-mono tabular-nums text-stone-600">
                        {lot.harvestDate}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedGatePassLot(lot)}
                          className="text-emerald-700 hover:text-emerald-900 font-medium underline text-[11px]"
                        >
                          View Pass & Certificate
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => onSelectLot(lot)}
                          className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => onToggleLotStatus(lot.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded ${
                            lot.harvestStatus === 'ready'
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          }`}
                        >
                          {lot.harvestStatus === 'ready' ? 'Mark Sold' : 'Set Active'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quotations / Enquiries Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {activeRole === 'farmer'
                  ? language === 'mr' ? 'वाइनरी व निर्यातदारांकडून आलेले खरेदी प्रस्ताव (RFQs)' : 'Incoming Purchase Proposals & RFQ Bids'
                  : language === 'mr' ? 'माझे पाठवलेले प्रस्ताव' : 'My Purchase Proposals & Negotiations'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'mr'
                  ? 'थेट व्यवहार निश्चित करण्यासाठी स्वीकारा, नकार द्या किंवा काउंटर ऑफर पाठवा.'
                  : 'Direct negotiation flow between growers and commercial buyers.'}
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              {inquiries.length} {language === 'mr' ? 'प्रस्ताव' : 'Proposals'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3">Party & Organization</th>
                  <th className="px-4 py-3">Lot & Farm</th>
                  <th className="px-4 py-3">Volume (MT)</th>
                  <th className="px-4 py-3">Offered Rate vs Ask</th>
                  <th className="px-4 py-3">Logistics</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Negotiation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inquiries.map((inq) => {
                  const isAccepted = inq.status === 'accepted';
                  const isCountered = inq.status === 'countered';
                  const isDeclined = inq.status === 'declined';

                  return (
                    <tr key={inq.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900 text-sm">
                          {activeRole === 'farmer' ? inq.companyName : inq.farmName}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {activeRole === 'farmer' ? `${inq.buyerName} · ${inq.buyerPhone}` : `Grower: ${inq.farmerName}`}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-stone-800">{inq.lotVariety}</div>
                        <div className="text-stone-400 text-[10px] font-mono">{inq.id}</div>
                      </td>

                      <td className="px-4 py-4 font-mono tabular-nums font-bold text-stone-900">
                        {inq.requestedQuantityTons} MT
                      </td>

                      <td className="px-4 py-4 font-mono tabular-nums">
                        <div className="text-sm font-bold text-emerald-800">₹{inq.offeredRatePerKg}/kg</div>
                        <div className="text-[11px] text-stone-500">Asking: ₹{inq.askingRatePerKg}/kg</div>
                        {inq.counterRatePerKg && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Counter: ₹{inq.counterRatePerKg}/kg
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-stone-600 text-[11px]">
                        {inq.deliveryTerms}
                      </td>

                      <td className="px-4 py-4">
                        {isAccepted && (
                          <span className="inline-flex items-center text-emerald-700 font-semibold text-xs">
                            ✓ Accepted & Booked
                          </span>
                        )}
                        {isCountered && (
                          <span className="inline-flex items-center text-amber-700 font-semibold text-xs">
                            ⇄ Counter-offered
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center text-rose-700 font-semibold text-xs">
                            ✕ Declined
                          </span>
                        )}
                        {inq.status === 'pending' && (
                          <span className="inline-flex items-center text-blue-700 font-semibold text-xs">
                            ⏳ Under Review
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {activeRole === 'farmer' && inq.status === 'pending' && (
                          <>
                            {counterInputId === inq.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <input
                                  type="number"
                                  value={counterRateValue}
                                  onChange={(e) => setCounterRateValue(parseFloat(e.target.value) || 0)}
                                  className="w-16 px-1.5 py-0.5 text-xs border border-stone-300 rounded font-mono"
                                />
                                <button
                                  onClick={() => handleSendCounter(inq.id)}
                                  className="px-2 py-1 text-xs bg-amber-600 text-white rounded font-medium"
                                >
                                  Send
                                </button>
                                <button
                                  onClick={() => setCounterInputId(null)}
                                  className="px-1.5 py-1 text-xs text-stone-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => onUpdateInquiryStatus(inq.id, 'accepted')}
                                  className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-colors"
                                >
                                  Accept Offer
                                </button>
                                <button
                                  onClick={() => {
                                    setCounterInputId(inq.id);
                                    setCounterRateValue(inq.askingRatePerKg);
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                                >
                                  Counter
                                </button>
                                <button
                                  onClick={() => onUpdateInquiryStatus(inq.id, 'declined')}
                                  className="px-2.5 py-1 text-xs font-medium text-rose-900 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {activeRole !== 'farmer' && (
                          <a
                            href={`tel:${inq.buyerPhone}`}
                            className="px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
                          >
                            Call Farm Manager
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable APMC Lot Inspection Pass Modal */}
        {selectedGatePassLot && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full border border-stone-300 p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <div className="text-xs uppercase font-mono text-emerald-800">
                    Nashik Grape Growers Association (NGGA)
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    Official Farm-Gate Mandi Inspection Certificate
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedGatePassLot(null)}
                  className="text-stone-400 hover:text-stone-900"
                >
                  ✕
                </button>
              </div>

              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500">Certificate No:</span>
                  <span className="font-bold">{selectedGatePassLot.labReportNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Vineyard:</span>
                  <span>{selectedGatePassLot.farmName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Farmer:</span>
                  <span>{selectedGatePassLot.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Taluka / District:</span>
                  <span>{selectedGatePassLot.taluka}, Nashik, MH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Grape Variety:</span>
                  <span className="font-bold">{selectedGatePassLot.variety}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Certified Sugar Brix:</span>
                  <span className="font-bold text-emerald-700">{selectedGatePassLot.brix}° Bx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Residual Pest Limit (MRL):</span>
                  <span className="font-bold text-emerald-700">COMPLIANT (EU / APEDA 2026)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Lot Net Weight:</span>
                  <span>{selectedGatePassLot.totalQuantityTons} Metric Tons</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 leading-normal">
                This digital pass is accepted at Pimpalgaon Baswant APMC sub-yards, APEDA packhouses, and winery weighbridges across the Nashik wine cluster.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
                >
                  Print / Save Pass (PDF)
                </button>
                <button
                  onClick={() => setSelectedGatePassLot(null)}
                  className="px-4 py-2 text-xs font-semibold bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
