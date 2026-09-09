import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '../../../lib/og-image';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { data } = props.post;
  const published = data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const png = await renderOgPng({
    eyebrow: 'WRITING',
    title: data.title,
    subtitle: data.summary,
    stats: [
      { num: data.readingTime, label: 'read time' },
      { num: published, label: 'published' },
    ],
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
