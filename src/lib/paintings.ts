// Every painting the site shows, in one registry. Claude Monet (died 1926) and Gustav Klimt
// (died 1918), all public domain. Files come from Wikimedia Commons, self-hosted in public/art/
// as <file>-<width>.webp.

export interface Painting {
  id: string
  // largest file; srcset lists every width
  url: string
  srcset: string
  width: number
  height: number
  artist: string
  title: string
  year: string
  museum: string
  alt: string
  credit: string
  // object-position for the crop, so the subject stays in frame at 50vw and at 4/3
  focal: string
}

const WIDTHS = [640, 1280, 1920]

type PaintingInput = Omit<Painting, 'credit' | 'url' | 'srcset' | 'artist'> & { file: string; artist?: string }

function painting(p: PaintingInput): Painting {
  const { file, artist = 'Claude Monet', ...rest } = p
  return {
    ...rest,
    artist,
    url: `/art/${file}-1920.webp`,
    srcset: WIDTHS.map((w) => `/art/${file}-${w}.webp ${w}w`).join(', '),
    credit: `${artist}, ${p.title}, ${p.year}`,
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
  // per-post paintings: a post picks one with `painting: <key>` in its frontmatter
  wheatstacks: painting({
    id: 'wheatstacks-end-of-summer',
    file: 'wheatstacks',
    width: 1920,
    height: 1138,
    title: 'Stacks of Wheat (End of Summer)',
    year: '1890-91',
    museum: 'Art Institute of Chicago',
    alt: 'Two domed stacks of wheat cast long shadows across a sunlit field.',
    focal: '90% 60%',
  }),
  // Klimt landscapes, in the home rotation with San Giorgio (see pages/index.astro)
  klimtBirchForest: painting({
    id: 'klimt-birch-forest',
    file: 'klimt-birch-forest',
    artist: 'Gustav Klimt',
    width: 1920,
    height: 1893,
    title: 'Birch Forest',
    year: '1903',
    museum: 'Private collection',
    alt: 'Pale birch trunks rise from a forest floor covered in red and orange leaves.',
    focal: '50% 50%',
  }),
  klimtSunflowers: painting({
    id: 'klimt-sunflowers',
    file: 'klimt-sunflowers',
    artist: 'Gustav Klimt',
    width: 1920,
    height: 1946,
    title: 'Farm Garden with Sunflowers',
    year: '1907',
    museum: 'Österreichische Galerie Belvedere, Vienna',
    alt: 'Tall sunflowers stand among dense red, blue and white flowers in a green garden.',
    focal: '60% 30%',
  }),
  klimtAttersee: painting({
    id: 'klimt-attersee',
    file: 'klimt-attersee',
    artist: 'Gustav Klimt',
    width: 1920,
    height: 1917,
    title: 'Island in the Attersee',
    year: '1901-02',
    museum: 'Private collection',
    alt: 'A green lake shimmering almost edge to edge, with a small dark island at the top right.',
    focal: '70% 20%',
  }),
  klimtPearTree: painting({
    id: 'klimt-pear-tree',
    file: 'klimt-pear-tree',
    artist: 'Gustav Klimt',
    width: 1920,
    height: 1922,
    title: 'Pear Tree',
    year: '1903',
    museum: 'Busch-Reisinger Museum, Harvard Art Museums',
    alt: 'A huge pear tree canopy of dotted green, blue and yellow over an orchard of trunks.',
    focal: '50% 60%',
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
