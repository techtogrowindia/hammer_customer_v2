import { Order, Technician } from './types';

// ---------------------------------------------------------------------------
// DEV-ONLY mock data — one entry per case. Delete this file (and the
// case-switcher UI in the screen) once real order data is wired up.
// ---------------------------------------------------------------------------

const TECH_A: Technician = {
  name: 'Electrical And Plumbing Work',
  avatarUrl: 'https://i.pravatar.cc/200?img=33',
  verified: true,
  premium: true,
  skills: ['Electrician', 'Plumbing'],
  rating: 0,
  ratingCount: 0,
  distanceKm: 0,
  openNow: true,
};

const TECH_B: Technician = {
  name: 'Manikandan R',
  avatarUrl: 'https://i.pravatar.cc/200?img=15',
  verified: true,
  premium: true,
  skills: ['Electrician', 'Civil & Construction', 'Fabrication', 'Plumbing'],
  rating: 4,
  ratingCount: 2,
  distanceKm: 0,
  openNow: true,
};

const TECH_C: Technician = {
  name: 'Kalingarayan Electrical CCTV & Solar',
  avatarUrl: 'https://i.pravatar.cc/200?img=52',
  verified: false,
  premium: true,
  skills: ['CCTV', 'Solar Panel Installation'],
  rating: 0,
  ratingCount: 0,
  distanceKm: 0,
  openNow: true,
};

const GOWSIC: Technician = {
  name: 'Aswick Jothi',
  avatarUrl: 'https://i.pravatar.cc/200?img=8',
  verified: true,
  premium: true,
  skills: ['Carpentry', 'Door Repair'],
  rating: 4.6,
  ratingCount: 18,
  distanceKm: 2.4,
  openNow: true,
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'pending-demo',
    service: 'AC Installation',
    createdAt: '14 Feb 2026, 01:24 PM',
    status: 'pending',
    isProductOrder: true,
    offers: [],
    additionalQuotes: [],
  },
  {
    id: 'quoted-demo',
    service: 'AC Installation',
    createdAt: '14 Feb 2026, 01:24 PM',
    status: 'quoted',
    isProductOrder: true,
    offers: [
      { id: 'q1', technician: TECH_A, amount: 900, submittedAt: '01:40 PM' },
      { id: 'q2', technician: TECH_B, amount: 1100, submittedAt: '01:52 PM' },
      { id: 'q3', technician: TECH_C, amount: 950, submittedAt: '02:03 PM' },
    ],
    additionalQuotes: [],
  },
  {
    id: 'confirmed-assigned-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'assigned',
    etaMinutes: 25,
    additionalQuotes: [],
  },
  {
    id: 'confirmed-reached-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'reached',
    additionalQuotes: [],
  },
  {
    id: 'addlquote-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'pending' },
    ],
  },
  {
    id: 'hold-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'on_hold',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    holdReason: 'Waiting for a replacement hinge part — expected to resume within 2 hours.',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
  },
  {
    id: 'completing-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'completing',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
    completionOtp: '4821',
  },
  {
    id: 'completed-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'completed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
    completedAt: '31 Jan 2026, 04:10 PM',
    concernWindowDaysLeft: 6,
  },
  {
    id: 'cancelled-demo',
    service: 'Bathroom Deep Cleaning',
    createdAt: '10 Feb 2026, 11:00 AM',
    status: 'cancelled',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: TECH_A, amount: 650, submittedAt: '11:10 AM' }],
    acceptedOffer: { id: 'q1', technician: TECH_A, amount: 650, submittedAt: '11:10 AM' },
    confirmedPhase: 'reached',
    additionalQuotes: [],
    cancelledAt: '11:45 AM',
    cancellationFee: 100,
  },
];
