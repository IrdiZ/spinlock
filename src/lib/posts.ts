import { getCollection } from 'astro:content'

// Published posts, newest first. Drafts show in `astro dev` only, never in a build.
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
