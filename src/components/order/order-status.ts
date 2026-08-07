import { AppColors } from '@/core/theme/app-colors';

/**
 * The order statuses the API actually sends, and what to show for each.
 *
 * The server has ten, lowercased from its own enum (see /api-docs, cust-orders).
 * The list card knew four of them and fell through to "Unknown", so every job
 * that was actually in progress — assigned, on the way, on hold, waiting for
 * the customer to confirm — read as Unknown on the orders tab. The filter chips
 * were worse: they compared a UI word like `pending` against the wire value
 * `pending_technician`, so Pending and Ongoing both matched nothing at all and
 * returned an empty list.
 *
 * Both now go through here. One place that knows what the server can say, so a
 * screen cannot quietly know a different subset than its neighbour.
 */
export type WireStatus =
  | 'pending_technician'
  | 'technician_assigned'
  | 'started'
  | 'reached'
  | 'hold'
  | 'pending_confirmation'
  | 'completed'
  | 'pending_payment'
  | 'paid'
  | 'cancelled';

/** The four groups the orders tab filters by. */
export type OrderBucket = 'pending' | 'ongoing' | 'completed' | 'cancelled';

const BUCKET: Record<WireStatus, OrderBucket> = {
  pending_technician: 'pending',
  technician_assigned: 'ongoing',
  started: 'ongoing',
  reached: 'ongoing',
  hold: 'ongoing',
  // The technician has finished and is waiting on the customer. Work is still
  // in flight from the customer's side — it needs them to do something.
  pending_confirmation: 'ongoing',
  completed: 'completed',
  // The job is done either way; money owed is a separate matter and does not
  // belong under "ongoing", where it would look like someone is still working.
  pending_payment: 'completed',
  paid: 'completed',
  cancelled: 'cancelled',
};

/** Wording follows the admin panel's badge, so both describe a state the same way. */
const DISPLAY: Record<WireStatus, { label: string; color: string }> = {
  pending_technician: { label: 'Awaiting quotes', color: AppColors.warning },
  technician_assigned: { label: 'Technician assigned', color: AppColors.info },
  started: { label: 'On the way', color: AppColors.info },
  reached: { label: 'Technician arrived', color: AppColors.info },
  hold: { label: 'On hold', color: AppColors.warning },
  // Actionable, and it used to be one of the "Unknown" ones — the customer had
  // no idea the job was waiting on them.
  pending_confirmation: { label: 'Confirm completion', color: AppColors.primaryDark },
  completed: { label: 'Completed', color: AppColors.success },
  pending_payment: { label: 'Payment due', color: AppColors.warning },
  paid: { label: 'Paid', color: AppColors.success },
  cancelled: { label: 'Cancelled', color: AppColors.error },
};

/** `pending_confirmation` → `Pending confirmation`, for anything not listed. */
const humanise = (s: string) =>
  s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

/**
 * A status the server added after this build shipped degrades to its own name,
 * not to "Unknown". Wrong-but-readable beats confidently blank, and the label
 * is the thing that tells whoever sees it what to add here.
 */
export function statusDisplay(status?: string | null): { label: string; color: string } {
  if (!status) return { label: 'Awaiting quotes', color: AppColors.warning };
  return (
    DISPLAY[status as WireStatus] ?? {
      label: humanise(status),
      color: AppColors.textSecondary,
    }
  );
}

/**
 * Which filter chip an order belongs under.
 *
 * An unrecognised status falls to `ongoing` rather than being dropped: it is a
 * live job the app does not have a word for yet, and hiding it from every chip
 * would lose it from the list entirely.
 */
export function bucketOf(status?: string | null): OrderBucket {
  if (!status) return 'pending';
  return BUCKET[status as WireStatus] ?? 'ongoing';
}
