// One place for the site identity. Nothing else hardcodes it.
export const SITE_NAME = 'spinlock'
export const SITE_NAME_SUFFIX = '_01'
export const SITE_DOMAIN = 'irdizeneli.dev'
export const SITE_HANDLE = '@spinlock_01'
export const SITE_X_URL = 'https://x.com/spinlock_01'
export const SITE_GITHUB_URL = 'https://github.com/IrdiZ'
export const SITE_LINKEDIN_URL = 'https://www.linkedin.com/in/irdizeneli/'
export const SITE_REPO_URL = 'https://github.com/IrdiZ/spinlock'
export const SITE_LOCATION = 'Maastricht NL'
export const SITE_AUTHOR = 'Irdi Zeneli'
// Homepage <title>. Carries the name and the pitch, since "spinlock" alone matches nothing anyone searches.
export const SITE_TITLE = 'spinlock · Irdi Zeneli, harness and AI infra engineer'

// Buttondown username for the subscribe form (buttondown.com/<name>). Empty hides the form everywhere.
export const SITE_BUTTONDOWN = 'irdizeneli'

// The exact X bio, one line per entry.
export const SITE_BIO = [
  'Harness and AI infra engineer.',
  'Building in public.',
] as const
