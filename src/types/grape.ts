export type GrapeCategory = 'export' | 'wine' | 'domestic' | 'raisin';

export type TalukaLocation =
  | 'Niphad'
  | 'Dindori'
  | 'Pimpalgaon Baswant'
  | 'Chandwad'
  | 'Satana'
  | 'Sinnar'
  | 'Nashik';

export type GrapeVariety =
  | 'Thompson Seedless'
  | 'Super Sonaka'
  | 'Sharad Seedless'
  | 'Red Globe'
  | 'Crimson Seedless'
  | 'Cabernet Sauvignon'
  | 'Shiraz'
  | 'Chenin Blanc'
  | 'Sauvignon Blanc'
  | 'Manik Chaman'
  | 'Jumbo Seedless';

export interface GrapeLot {
  id: string;
  farmerName: string;
  farmerMarathiName?: string;
  farmName: string;
  phone: string;
  taluka: TalukaLocation;
  village: string;
  variety: GrapeVariety;
  category: GrapeCategory;
  brix: number; // Sugar content (°Bx)
  acidityPercent: number; // Titratable Acidity %
  berrySizeMm?: number; // Berry diameter for table grapes
  totalQuantityTons: number;
  availableQuantityTons: number;
  minOrderTons: number;
  pricePerKg: number;
  harvestDate: string;
  certifications: string[];
  imageUrl: string;
  harvestStatus: 'ready' | 'harvesting' | 'upcoming';
  description: string;
  isVerified: boolean;
  labReportNumber: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  lotId: string;
  lotVariety: string;
  farmName: string;
  farmerName: string;
  buyerType: 'winery' | 'exporter' | 'retailer';
  buyerName: string;
  companyName: string;
  buyerPhone: string;
  buyerEmail: string;
  requestedQuantityTons: number;
  offeredRatePerKg: number;
  askingRatePerKg: number;
  deliveryTerms: 'Farm-gate Pickup' | 'Cold Storage Delivery' | 'Ex-Packhouse';
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  notes: string;
  counterRatePerKg?: number;
  createdAt: string;
}

export interface MandiRate {
  id: string;
  variety: string;
  market: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  dailyChangePercent: number;
  arrivalsTodayTons: number;
  trend: 'up' | 'down' | 'steady';
}

export type UserRole = 'farmer' | 'winery' | 'exporter' | 'guest';

export type Language = 'en' | 'mr';
