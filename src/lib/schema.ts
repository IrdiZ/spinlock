import type { CollectionEntry } from 'astro:content'
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
