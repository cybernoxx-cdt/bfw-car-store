// Central type definitions for every Firestore collection in the app.
// Keeping these in one file gives the data layer, admin forms and public
// pages a single source of truth for shape.

export type Timestamp = { seconds: number; nanoseconds: number } | Date | null;

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  description: string;
  carImage: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CarSpecifications {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  drive: string;
  topSpeed: string;
  zeroToHundred: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  basePrice: number;
  currency: string;
  description: string;
  specifications: CarSpecifications;
  heroImage: string;
  galleryImages: string[];
  featured: boolean;
  available: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Modification {
  id: string;
  carId: string;
  compatibility: string[]; // additional carIds this part also fits
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  gallery?: string[];
  overlayImage?: string; // transparent PNG/WebP for the visual configurator
  overlayTop?: number; // % offset, for fine-tuning the overlay
  overlayLeft?: number;
  overlayWidth?: number;
  available: boolean;
  featured: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt?: Timestamp;
}

export interface SelectedModSnapshot {
  id: string;
  name: string;
  price: number;
  categoryId?: string;
}

export type LeadStatus = "NEW" | "CONTACTED" | "COMPLETED" | "CANCELLED";

export interface Lead {
  id: string;
  carId: string;
  carName: string;
  selectedModifications: SelectedModSnapshot[];
  totalPrice: number;
  currency: string;
  customerName?: string;
  customerPhone?: string;
  status: LeadStatus;
  createdAt?: Timestamp;
}

export interface BusinessSettings {
  businessName: string;
  logo: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  instagram?: string;
  facebook?: string;
  currency: string;
  businessHours: string;
  accentColor?: string;
}

export interface AboutInfo {
  ownerName: string;
  ownerRole: string;
  ownerImage: string;
  biography: string;
  companyStory: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  folder: string;
  createdAt?: Timestamp;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: "admin";
  createdAt?: Timestamp;
}
