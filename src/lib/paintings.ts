// Every painting the site shows, in one registry. All by Claude Monet (died 1926), public domain.
// TODO: swap to self-hosted after download approval. Point `url` at /art/<id>.webp and
// update width/height; no other file needs to change.

export interface Painting {
  id: string
  url: string
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

const commons = 'https://upload.wikimedia.org/wikipedia/commons/thumb'

function painting(p: Omit<Painting, 'credit'>): Painting {
  return { ...p, credit: `Claude Monet, ${p.title}, ${p.year}` }
}

export const paintings = {
  home: painting({
    id: 'san-giorgio-dusk',
    url: `${commons}/d/da/Claude_Monet%2C_Saint-Georges_majeur_au_cr%C3%A9puscule.jpg/1920px-Claude_Monet%2C_Saint-Georges_majeur_au_cr%C3%A9puscule.jpg`,
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
    url: `${commons}/0/0b/Claude_Monet%2C_The_Houses_of_Parliament%2C_Sunset%2C_1903%2C_NGA_46523.jpg/1920px-Claude_Monet%2C_The_Houses_of_Parliament%2C_Sunset%2C_1903%2C_NGA_46523.jpg`,
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
    url: `${commons}/7/78/Claude_Monet_-_The_Magpie_-_Google_Art_Project.jpg/1920px-Claude_Monet_-_The_Magpie_-_Google_Art_Project.jpg`,
    width: 1920,
    height: 1302,
    title: 'The Magpie',
    year: '1868-69',
    museum: "Musée d'Orsay, Paris",
    alt: 'A single magpie sits on a wooden gate in a wide field of snow.',
    focal: '35% 50%',
  }),
} satisfies Record<string, Painting>
