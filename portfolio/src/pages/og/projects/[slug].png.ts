import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '../../../lib/og-image';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => data.hasPage);
  return projects.map((project) => ({
    params: { slug: project.data.slug },
    props: { project },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { data } = props.project;
  const png = await renderOgPng({
    eyebrow: data.tags.join(' · ').toUpperCase(),
    title: data.title,
    subtitle: data.summary,
    stats: [{ num: data.metric, label: data.flag ?? String(data.year) }],
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
