import { LucideIcon } from 'lucide-react-native';

export type IconType = LucideIcon;

export interface CategoryItem {
  id: string;
  label: string;
  Icon?: IconType;
}

export interface BannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
}

export interface BookAgainItem {
  id: string;
  name: string;
  lastDate: string;
  Icon: IconType;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  rating: string;
  bookings: string;
  Icon: IconType;
}

export interface HowItWorksStep {
  id: string;
  label: string;
  Icon: IconType;
}
