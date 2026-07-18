// Adjust this path to wherever CategoryItem actually lives in your project.

import { CategoryItem } from '@/components/home/home.types';

// Same image pool CategoryScroller uses — cycled by index so every card
// still gets an image even though there are more categories than photos.
export const categoryImages = [
  'https://picsum.photos/id/1062/120/120',
  'https://picsum.photos/id/1074/120/120',
  'https://picsum.photos/id/1080/120/120',
  'https://picsum.photos/id/1084/120/120',
  'https://picsum.photos/id/1081/120/120',
  'https://picsum.photos/id/1067/120/120',
];

// DEV-ONLY mock data — replace with the real 24 categories from your API.
export const ALL_CATEGORIES: CategoryItem[] = [
  { id: 'electrician', label: 'Electrician' },
  { id: 'plumber', label: 'Plumber' },
  { id: 'carpenter', label: 'Carpenter' },
  { id: 'painter', label: 'Painter' },
  { id: 'ac-repair', label: 'AC Repair' },
  { id: 'appliance-repair', label: 'Appliance Repair' },
  { id: 'pest-control', label: 'Pest Control' },
  { id: 'home-cleaning', label: 'Home Cleaning' },
  { id: 'bathroom-cleaning', label: 'Bathroom Cleaning' },
  { id: 'sofa-cleaning', label: 'Sofa Cleaning' },
  { id: 'salon-women', label: 'Salon for Women' },
  { id: 'salon-men', label: 'Salon for Men' },
  { id: 'massage', label: 'Massage Therapy' },
  { id: 'car-wash', label: 'Car Wash' },
  { id: 'bike-repair', label: 'Bike Repair' },
  { id: 'cctv-installation', label: 'CCTV Installation' },
  { id: 'solar-panel', label: 'Solar Panel' },
  { id: 'water-purifier', label: 'Water Purifier' },
  { id: 'chimney-repair', label: 'Chimney Repair' },
  { id: 'gardening', label: 'Gardening' },
  { id: 'packers-movers', label: 'Packers & Movers' },
  { id: 'interior-design', label: 'Interior Design' },
  { id: 'home-security', label: 'Home Security' },
  { id: 'waterproofing', label: 'Waterproofing' },
];
