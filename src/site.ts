// One place for the site identity and the debt numbers. Nothing else hardcodes them.
export const SITE_NAME = 'spinlock'
export const SITE_NAME_SUFFIX = '_01'
export const SITE_DOMAIN = 'irdizeneli.dev'
export const SITE_HANDLE = '@spinlock_01'
export const SITE_X_URL = 'https://x.com/spinlock_01'
export const SITE_GITHUB_URL = 'https://github.com/IrdiZ'
export const SITE_LINKEDIN_URL = 'https://www.linkedin.com/in/irdizeneli/'
export const SITE_REPO_URL = 'https://github.com/IrdiZ/spinlock'
export const SITE_LOCATION = 'Maastricht NL'

// The exact X bio, one line per entry.
export const SITE_BIO = [
  'Systems nerd vs. student debt.',
  'Shipping indie products until one wins.',
  'Building in public.',
] as const

// Same meaning as PAID in my_data/twitter/make_banner.py. Update both by hand when a payment lands.
export const DEBT_TOTAL = 20000
export const DEBT_PAID = 0
export const DEBT_CURRENCY = 'EUR'
