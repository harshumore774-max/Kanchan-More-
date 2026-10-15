import React from 'react';
import { UserRole, Language } from '../types/grape';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  language: Language;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  language,
}) => {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'farmer' as UserRole,
      title: language === 'mr' ? 'द्राक्ष बागायतदार (Farmer)' : 'Grape Farmer / Viticulturist',
      persona: 'Sachin Patil · Sahyadri Crest Orchards, Niphad',
      desc: language === 'mr'
        ? 'नवीन द्राक्ष लॉट नोंदवा, वाइनरी व निर्यातदारांचे खरेदी प्रस्ताव स्वीकारा, मंडी गेटपास मिळवा.'
        : 'Post harvest batches, review inbound RFQ bids from wineries and exporters, send counter-offers, and print APMC certificates.',
      icon: '🍇',
    },
    {
      id: 'winery' as UserRole,
      title: language === 'mr' ? 'वाइनरी खरेदीदार (Winery Cellar)' : 'Commercial Winery Procurement',
      persona: 'Dr. Alok Sen · Heritage Valley Winery, Dindori',
      desc: language === 'mr'
        ? 'उच्च ब्रिक्स (21°+) द्राक्षांची खरेदी करा, वाइन क्रश व अल्कोहोल (ABV) मोजा, फार्म-गेट करार करा.'
        : 'Source high-Brix wine grapes (Cabernet, Shiraz, Chenin), model fermentation yield, and propose contract pricing.',
      icon: '🍷',
    },
    {
      id: 'exporter' as UserRole,
      title: language === 'mr' ? 'द्राक्ष निर्यातदार (Export House)' : 'APEDA Fresh Fruit Exporter',
      persona: 'Vikramaditya Roy · EuroFresh Agri Logistics BV',
      desc: language === 'mr'
        ? 'युरोप व गल्फसाठी रेसिड्यू-फ्री व ग्लोबलगॅप प्रमाणित द्राक्ष लॉट्स बुक करा, शीत साखळी तपासा.'
        : 'Procure export-grade table grapes (Thompson, Super Sonaka), verify MRL lab reports, and manage container logistics.',
      icon: '🚢',
    },
    {
      id: 'guest' as UserRole,
      title: language === 'mr' ? 'सार्वजनिक अभ्यागत (Guest)' : 'Public Guest / Explorer',
      persona: 'Public Viewer',
      desc: language === 'mr'
        ? 'नाशिक जिल्ह्यातील द्राक्ष बाजारभाव आणि उपलब्ध शेती लॉटचे निरीक्षण करा.'
        : 'Browse open marketplace and APMC market prices without administrative dashboard privileges.',
      icon: '🔍',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-400 font-mono">ACCOUNT PERSPECTIVE SWITCHER</div>
            <h3 className="text-base font-bold">
              {language === 'mr' ? 'वापरकर्ता भूमिका निवडा' : 'Select Active Stakeholder Role'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-stone-500 mb-2">
            Switch seamlessly between farmer, winemaker, and exporter personas to test interactive features, RFQ workflows, and dashboards:
          </p>

          {roles.map((r) => {
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="text-2xl p-2 bg-white rounded-lg border border-stone-200 shrink-0 shadow-sm">
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{r.title}</span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-emerald-800 mt-0.5">{r.persona}</div>
                  <div className="text-xs text-stone-600 mt-1 leading-relaxed">{r.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
