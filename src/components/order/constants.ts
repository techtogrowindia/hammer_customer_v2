import { AppColors } from '@/core/theme/app-colors';
import { OrderStatus } from './types';

export const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: AppColors.textSecondary, bg: AppColors.divider },
  quoted: { label: 'Quotes received', color: AppColors.primaryDark, bg: AppColors.warningLight },
  confirmed: { label: 'Processing', color: AppColors.primaryDark, bg: AppColors.warningLight },
  on_hold: { label: 'On hold', color: AppColors.error, bg: '#FDE8E8' },
  completing: { label: 'Awaiting confirmation', color: AppColors.primaryDark, bg: AppColors.warningLight },
  completed: { label: 'Completed', color: AppColors.success, bg: '#E6F4EA' },
  cancelled: { label: 'Cancelled', color: AppColors.error, bg: '#FDE8E8' },
};

export const genTicketId = () => `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
