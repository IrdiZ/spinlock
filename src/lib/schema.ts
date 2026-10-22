import type { CollectionEntry } from 'astro:content'
import { when, type TimelineEntry } from './projects'
import {
  SITE_AUTHOR,
  SITE_NAME,
  SITE_BIO,
  SITE_X_URL,
  SITE_GITHUB_URL,
  SITE_LINKEDIN_URL,
} from '../site'

// schema.org JSON-LD for search engines. Ties the blog, the posts and the profiles to one person.

export function person(base: URL) {
  return {
    '@type': 'Person',
    '@id': new URL('/#person', base).toString(),
    name: SITE_AUTHOR,
    url: base.toString(),
    image: new URL('/me.jpg', base).toString(),
    jobTitle: 'Computer science student and freelance developer',
    homeLocation: { '@type': 'Place', name: 'Maastricht, Netherlands' },
    sameAs: [SITE_X_URL, SITE_GITHUB_URL, SITE_LINKEDIN_URL],
  }
}

export function homeSchema(base: URL) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person(base),
      {
        '@type': 'WebSite',
        '@id': new URL('/#website', base).toString(),
        name: SITE_NAME,
        url: base.toString(),
        description: SITE_BIO[0],
        inLanguage: 'en',
        author: { '@id': new URL('/#person', base).toString() },
      },
    ],
  }
}

// The /projects timeline as one list of creative works. Public repos carry their code link.
export function projectsSchema(entries: TimelineEntry[], base: URL) {
  const url = new URL('/projects', base).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `projects · ${SITE_NAME}`,
    url,
    author: person(base),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: entries
        .filter((e) => e.data.type === 'project')
        .map((e, i) => {
          const code = e.links.find((l) => l.label === 'github')
          return {
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': code ? 'SoftwareSourceCode' : 'CreativeWork',
              name: e.data.name,
              description: e.data.blurb,
              dateCreated: when(e.data.date, e.data.precision),
              url: `${url}#${e.id}`,
              ...(code ? { codeRepository: code.href } : {}),
            },
          }
        }),
    },
  }
}

export function postSchema(post: CollectionEntry<'posts'>, base: URL, image: string) {
  const url = new URL(`/posts/${post.id}`, base).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.excerpt,
    datePublished: post.data.date.toISOString(),
    url,
    mainEntityOfPage: url,
    image,
    keywords: post.data.tags.join(', '),
    inLanguage: 'en',
    author: person(base),
    publisher: { '@id': new URL('/#person', base).toString() },
  }
}
