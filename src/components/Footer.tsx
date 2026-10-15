import React from 'react';
import { Language } from '../types/grape';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span>🍇</span>
              <span>Nashik Grape Connect</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {language === 'mr'
                ? 'नाशिक जिल्ह्यातील द्राक्ष उत्पादक, वाइनरी व निर्यातदारांना जोडणारे थेट डिजिटल व्यासपीठ.'
                : 'Direct digital ecosystem connecting Nashik viticulturists, commercial wineries, and global APEDA fruit exporters.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              {language === 'mr' ? 'प्रमुख विभाग' : 'Grape Belts'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Pimpalgaon Baswant APMC</li>
              <li>Niphad Valley Orchards</li>
              <li>Dindori Wine Hills</li>
              <li>Chandwad & Satana (Baglan)</li>
              <li>Sanjegaon Agro Cluster</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              {language === 'mr' ? 'द्राक्ष वाण व उत्पादने' : 'Cultivars'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Thompson Seedless (Export)</li>
              <li>Super Sonaka & Manik Chaman</li>
              <li>Cabernet Sauvignon & Shiraz</li>
              <li>Chenin Blanc & Sauvignon Blanc</li>
              <li>Sharad Seedless & Red Globe</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              {language === 'mr' ? 'प्रकल्प व विकास' : 'Developer Kit'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Python Flask + SQLite Backend</li>
              <li>Jinja2 Web Templates</li>
              <li>APEDA Compliance & MRL Checklist</li>
              <li>VS Code Ready-to-Run Starter</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Nashik Grape Connect. Built for Maharashtra Viticulture & Wine Ecosystem.
          </div>
          <div className="flex items-center gap-4">
            <a href="#marketplace" className="hover:text-stone-300 transition-colors">Marketplace</a>
            <a href="#mandi-rates" className="hover:text-stone-300 transition-colors">Mandi Rates</a>
            <a href="#vscode-template" className="hover:text-stone-300 transition-colors">Download Template (ZIP)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
