import type { APIRoute } from 'astro';
import { renderOgPng } from '../../lib/og-image';

export const GET: APIRoute = async () => {
  const png = await renderOgPng({
    title: 'I build systems at the seams, where the backend, the model and the interface have to agree.',
    stats: [
      { num: '82%', label: 'cost reduction,\nHIRE4GIG engine' },
      { num: '38ms', label: 'per matching window,\n50,000 orders' },
      { num: '0.949', label: 'ROC-AUC, pneumonia\nensemble' },
      { num: '1', label: 'patent application\nfiled' },
    ],
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
