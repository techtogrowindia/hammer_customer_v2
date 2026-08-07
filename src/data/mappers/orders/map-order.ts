import { AdditionalQuote, ConfirmedPhase, Order, OrderStatus, QuoteOffer } from '@/components/order/types';
import { GPDData } from '@/domain/models/orders/place-order-response';

/**
 * Turns one order from the API into what the detail screen draws.
 *
 * The screen was built against mock data and its own vocabulary — `quoted`,
 * `confirmed`, `on_hold` — while the API speaks pending_technician,
 * technician_assigned, hold. Neither side is wrong; they just needed
 * introducing, and until they were, the screen showed a prototype and the
 * Accept button changed nothing outside the phone.
 */
const STATUS: Record<string, OrderStatus> = {
  pending_technician: 'pending',
  technician_assigned: 'confirmed',
  started: 'confirmed',
  reached: 'confirmed',
  hold: 'on_hold',
  pending_confirmation: 'completing',
  completed: 'completed',
  // Not reachable through the technician flow, but an admin can set either by
  // hand from the dashboard. Leaving them out meant they fell to the
  // `?? 'pending'` below, so a finished — even a paid — job read as though no
  // technician had been found yet.
  pending_payment: 'completed',
  paid: 'completed',
  cancelled: 'cancelled',
};

const PHASE: Record<string, ConfirmedPhase> = {
  technician_assigned: 'assigned',
  started: 'started',
  reached: 'reached',
};

/** A technician we know little about — the order payload carries a name, not a profile. */
const technicianFrom = (name: string) => ({
  name: name || 'Technician',
  verified: true,
  premium: false,
  skills: [],
  rating: 0,
  ratingCount: 0,
  distanceKm: 0,
  openNow: true,
});

export function mapOrder(o: GPDData): Order {
  const wire = String(o.status ?? 'pending_technician');

  const offers: QuoteOffer[] = (o.technician_quotes ?? [])
    .filter((q) => q.quote_submitted && q.amount != null)
    .map((q) => ({
      id: String(q.technician_id),
      technician: technicianFrom(String(q.technician_name ?? '')),
      amount: Number(q.amount ?? 0),
      submittedAt: String(q.quoted_at ?? ''),
    }));

  const confirmed = o.confirmed_technician as { technician_id?: number; technician_name?: string } | null | undefined;
  const acceptedOffer = confirmed
    ? {
        id: String(confirmed.technician_id ?? ''),
        technician: technicianFrom(String(confirmed.technician_name ?? '')),
        amount: Number(o.amount_rupees ?? 0),
        submittedAt: '',
      }
    : undefined;

  const additionalQuotes: AdditionalQuote[] = (o.additional_quotes ?? []).map((q: any) => ({
    id: String(q.id),
    description: String(q.description ?? ''),
    amount: Number(q.amount ?? 0),
    status: q.status === 'confirmed' ? 'confirmed' : q.status === 'rejected' ? 'rejected' : 'pending',
  }));

  // A quote nobody has accepted yet is what the screen calls "quoted".
  const status: OrderStatus =
    STATUS[wire] === 'pending' && offers.length > 0 ? 'quoted' : (STATUS[wire] ?? 'pending');

  return {
    id: String(o.order_id ?? ''),
    service: String(o.service?.service_name ?? 'Service'),
    createdAt: String(o.created_at ?? ''),
    status,
    isProductOrder: false,
    offers,
    acceptedOffer,
    confirmedPhase: PHASE[wire],
    additionalQuotes,
    holdReason: (o as any).hold_reason || undefined,
    completedAt: status === 'completed' ? String(o.updated_at ?? '') : undefined,
    cancelledAt: status === 'cancelled' ? String(o.updated_at ?? '') : undefined,
  };
}
