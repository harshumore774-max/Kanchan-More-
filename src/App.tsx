import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MandiTicker } from './components/MandiTicker';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { LotDetailModal } from './components/LotDetailModal';
import { FarmerDashboard } from './components/FarmerDashboard';
import { WineryTools } from './components/WineryTools';
import { TemplateDownloader } from './components/TemplateDownloader';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { NewLotModal } from './components/NewLotModal';
import { Footer } from './components/Footer';

import { GrapeLot, Inquiry, MandiRate, UserRole, Language } from './types/grape';
import { INITIAL_GRAPE_LOTS, INITIAL_INQUIRIES, INITIAL_MANDI_RATES } from './data/mockData';

export default function App() {
  // Application State with LocalStorage Persistence
  const [lots, setLots] = useState<GrapeLot[]>(() => {
    const saved = localStorage.getItem('nashik_grape_lots');
    return saved ? JSON.parse(saved) : INITIAL_GRAPE_LOTS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('nashik_grape_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [mandiRates] = useState<MandiRate[]>(INITIAL_MANDI_RATES);
  const [activeRole, setActiveRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<Language>('en');

  // Modal States
  const [selectedLotForModal, setSelectedLotForModal] = useState<GrapeLot | null>(null);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isNewLotModalOpen, setIsNewLotModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('nashik_grape_lots', JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem('nashik_grape_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Handler: Add New Grape Harvest Batch
  const handleAddLot = (newLot: GrapeLot) => {
    setLots((prev) => [newLot, ...prev]);
  };

  // Handler: Submit RFQ Inquiry Proposal
  const handleSubmitInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Handler: Update Inquiry Status (Accept, Counter, Decline)
  const handleUpdateInquiryStatus = (
    inquiryId: string,
    newStatus: 'accepted' | 'countered' | 'declined',
    counterRate?: number
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            status: newStatus,
            counterRatePerKg: counterRate !== undefined ? counterRate : inq.counterRatePerKg,
          };
        }
        return inq;
      })
    );
  };

  // Handler: Toggle Lot Active/Sold
  const handleToggleLotStatus = (lotId: string) => {
    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id === lotId) {
          const nextStatus = lot.harvestStatus === 'ready' ? 'upcoming' : 'ready';
          return { ...lot, harvestStatus: nextStatus };
        }
        return lot;
      })
    );
  };

  // Open Specs / RFQ
  const handleSelectLot = (lot: GrapeLot) => {
    setSelectedLotForModal(lot);
    setIsLotModalOpen(true);
  };

  const handleOpenRFQ = (lot: GrapeLot) => {
    setSelectedLotForModal(lot);
    setIsLotModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top 3-Zone Navigation Header */}
      <Header
        activeRole={activeRole}
        language={language}
        onLanguageToggle={() => setLanguage((prev) => (prev === 'en' ? 'mr' : 'en'))}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenNewLotModal={() => setIsNewLotModalOpen(true)}
      />

      {/* APMC Mandi Ticker Bar */}
      <section id="mandi-rates">
        <MandiTicker rates={mandiRates} language={language} />
      </section>

      {/* Hero Section */}
      <Hero
        language={language}
        onExploreClick={() => scrollToSection('marketplace')}
        onPostBatchClick={() => {
          setActiveRole('farmer');
          setIsNewLotModalOpen(true);
        }}
        onViewTemplateClick={() => scrollToSection('vscode-template')}
      />

      {/* Grape Marketplace */}
      <Marketplace
        lots={lots}
        language={language}
        onSelectLot={handleSelectLot}
        onOpenRFQ={handleOpenRFQ}
      />

      {/* Farmer & Buyer Dashboard */}
      <FarmerDashboard
        lots={lots}
        inquiries={inquiries}
        activeRole={activeRole}
        language={language}
        onOpenNewLotModal={() => setIsNewLotModalOpen(true)}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onToggleLotStatus={handleToggleLotStatus}
        onSelectLot={handleSelectLot}
      />

      {/* Winemaker & Exporter Technical Tools */}
      <WineryTools language={language} />

      {/* Download Website Template & VS Code Starter Suite */}
      <TemplateDownloader language={language} />

      {/* Footer */}
      <Footer language={language} />

      {/* Modals */}
      <LotDetailModal
        lot={selectedLotForModal}
        isOpen={isLotModalOpen}
        onClose={() => {
          setIsLotModalOpen(false);
          setSelectedLotForModal(null);
        }}
        onSubmitInquiry={handleSubmitInquiry}
        activeRole={activeRole}
        language={language}
      />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={activeRole}
        onSelectRole={(role) => setActiveRole(role)}
        language={language}
      />

      {/* New Lot Modal */}
      <NewLotModal
        isOpen={isNewLotModalOpen}
        onClose={() => setIsNewLotModalOpen(false)}
        onAddLot={handleAddLot}
        language={language}
      />
    </div>
  );
}
