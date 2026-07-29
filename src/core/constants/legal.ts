export const LEGAL_LINKS = {
  terms: {
    title: 'Terms & Conditions',
    url: 'https://hammerapp.in/terms',
  },
  privacy: {
    title: 'Privacy Policy',
    url: 'https://privacy-policy-hammer.vercel.app/',
  },
} as const;

export type LegalDocType = keyof typeof LEGAL_LINKS;
