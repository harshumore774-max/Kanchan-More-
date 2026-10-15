import React from 'react';
import { UserRole, Language } from '../types/grape';

interface HeaderProps {
  activeRole: UserRole;
  language: Language;
  onLanguageToggle: () => void;
  onOpenRoleModal: () => void;
  onOpenNewLotModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  language,
  onLanguageToggle,
  onOpenRoleModal,
  onOpenNewLotModal,
}) => {
  const getRoleLabel = () => {
    switch (activeRole) {
      case 'farmer':
        return language === 'mr' ? 'शेतकरी पोर्टल' : 'Farmer Portal';
      case 'winery':
        return language === 'mr' ? 'वाइनरी खरेदीदार' : 'Winery Procurement';
      case 'exporter':
        return language === 'mr' ? 'द्राक्ष निर्यातदार' : 'Export Buyer';
      default:
        return language === 'mr' ? 'खाते निवडा' : 'Select Role';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors">
          <span className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-600 flex items-center justify-center text-base shadow-sm">
            🍇
          </span>
          <span>Nashik Grape Connect</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <a href="#marketplace" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'mr' ? 'द्राक्ष बाजारपेठ' : 'Grape Market'}
          </a>
          <a href="#mandi-rates" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'mr' ? 'बाजार भाव' : 'APMC Mandi Rates'}
          </a>
          <a href="#winery-tools" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'mr' ? 'वाइन व निर्यात टूल्स' : 'Enology & Export Tools'}
          </a>
          <a href="#dashboard" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard & Deals'}
          </a>
          <a href="#vscode-template" className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'mr' ? 'प्रकल्प टेम्पलेट' : 'VS Code Template'}
          </a>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLanguageToggle}
            aria-label="Toggle Language"
            className="px-2.5 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'mr' ? 'EN' : 'मराठी'}
          </button>

          {activeRole === 'farmer' ? (
            <button
              onClick={onOpenNewLotModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              {language === 'mr' ? '+ द्राक्ष लॉट जोडा' : '+ Post Grape Batch'}
            </button>
          ) : (
            <button
              onClick={onOpenRoleModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              {getRoleLabel()}
            </button>
          )}

          <button
            onClick={onOpenRoleModal}
            title="Switch User Role"
            className="p-2 text-xs text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
