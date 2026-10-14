// Every painting the site shows, in one registry. All by Claude Monet (died 1926), public domain.
// Files come from Wikimedia Commons, self-hosted in public/art/ as <file>-<width>.webp.

export interface Painting {
  id: string
  // largest file; srcset lists every width
  url: string
  srcset: string
  width: number
  height: number
  title: string
  year: string
  museum: string
  alt: string
  credit: string
  // object-position for the crop, so the subject stays in frame at 50vw and at 4/3
  focal: string
}

const WIDTHS = [640, 1280, 1920]

function painting(p: Omit<Painting, 'credit' | 'url' | 'srcset'> & { file: string }): Painting {
  const { file, ...rest } = p
  return {
    ...rest,
    url: `/art/${file}-1920.webp`,
    srcset: WIDTHS.map((w) => `/art/${file}-${w}.webp ${w}w`).join(', '),
    credit: `Claude Monet, ${p.title}, ${p.year}`,
  }
}

export const paintings = {
  home: painting({
    id: 'san-giorgio-dusk',
    file: 'san-giorgio',
    width: 1920,
    height: 1361,
    title: 'San Giorgio Maggiore at Dusk',
    year: '1908',
    museum: 'Fondation Beyeler',
    alt: 'A church on a small island at dusk, with an orange sky and violet water.',
    focal: '45% 50%',
  }),
  post: painting({
    id: 'parliament-sunset',
    file: 'parliament',
    width: 1920,
    height: 1696,
    title: 'The Houses of Parliament, Sunset',
    year: '1903',
    museum: 'National Gallery of Art, Washington',
    alt: 'The Parliament towers as blue shadows in fog, with a low orange sun on the river.',
    focal: '50% 40%',
  }),
  notFound: painting({
    id: 'magpie',
    file: 'magpie',
    width: 1920,
    height: 1302,
    title: 'The Magpie',
    year: '1868-69',
    museum: "Musée d'Orsay, Paris",
    alt: 'A single magpie sits on a wooden gate in a wide field of snow.',
    focal: '35% 50%',
  }),
} satisfies Record<string, Painting>
