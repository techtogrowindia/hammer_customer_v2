import { IconType } from '../home/home.types';

export interface ProfileUser {
  name: string;
  mobile: string;
  verified?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface MenuItem {
  id: string;
  label: string;
  subtitle?: string;
  Icon: IconType;
  route?: string;
}

export interface MenuSectionData {
  id: string;
  title: string;
  items: MenuItem[];
}
