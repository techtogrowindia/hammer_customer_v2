export type OrderStatus = 'pending' | 'quoted' | 'confirmed' | 'on_hold' | 'completing' | 'completed' | 'cancelled';

// Only meaningful while status === 'confirmed'. Drives cancellation rules:
// assigned -> free cancel, reached -> cancel with fee, started -> can't cancel.
export type ConfirmedPhase = 'assigned' | 'reached' | 'started';

export type Technician = {
  name: string;
  avatarUrl?: string;
  verified: boolean;
  premium: boolean;
  skills: string[];
  rating: number;
  ratingCount: number;
  distanceKm: number;
  openNow: boolean;
};

export type QuoteOffer = {
  id: string;
  technician: Technician;
  amount: number;
  submittedAt: string;
};

export type AdditionalQuote = {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
};

export type Order = {
  id: string;
  service: string;
  createdAt: string;
  status: OrderStatus;
  isProductOrder: boolean; // gates the "Concern with product" option post-completion
  offers: QuoteOffer[];
  acceptedOffer?: QuoteOffer;
  confirmedPhase?: ConfirmedPhase;
  etaMinutes?: number;
  additionalQuotes: AdditionalQuote[];
  holdReason?: string;
  completionOtp?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationFee?: number;
  concernWindowDaysLeft?: number;
  review?: { rating: number; comment: string };
};

export type ConcernType = 'service' | 'product';

export type PendingConfirm =
  | { kind: 'offer'; offer: QuoteOffer }
  | { kind: 'additional'; quote: AdditionalQuote }
  | { kind: 'cancel'; fee: number }
  | null;
