import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const PAPER = '#E9EBEE';
const INK = '#16181D';
const SOFT = '#5A606B';
const RULE = '#C9CDD4';
const FLAG = '#B4471F';

// Resolved from the project root (process.cwd() during `astro build`/`astro dev`),
// not import.meta.url — Vite relocates this module into dist/.prerender/chunks
// at build time, which would break a path computed relative to the source file.
const fontsDir = join(process.cwd(), 'src', 'lib', 'fonts');
const newsreaderLight = readFileSync(join(fontsDir, 'Newsreader-Light.ttf'));
const newsreaderMedium = readFileSync(join(fontsDir, 'Newsreader-Medium.ttf'));
const plexSans = readFileSync(join(fontsDir, 'IBMPlexSans-Regular.ttf'));
const plexMono = readFileSync(join(fontsDir, 'IBMPlexMono-Medium.ttf'));

const fonts = [
  { name: 'Newsreader', data: newsreaderLight, weight: 300 as const, style: 'normal' as const },
  { name: 'Newsreader', data: newsreaderMedium, weight: 500 as const, style: 'normal' as const },
  { name: 'IBM Plex Sans', data: plexSans, weight: 400 as const, style: 'normal' as const },
  { name: 'IBM Plex Mono', data: plexMono, weight: 500 as const, style: 'normal' as const },
];

export interface OgStat {
  num: string;
  label: string;
}

export interface OgImageProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stats: OgStat[];
}

function multiline(text: string) {
  const lines = text.split('\n');
  if (lines.length === 1) return text;
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column' },
      children: lines.map((line) => ({ type: 'div', props: { children: line } })),
    },
  };
}

export async function renderOgPng({ eyebrow, title, subtitle, stats }: OgImageProps): Promise<Buffer> {
  const titleSize = title.length > 40 ? 50 : 62;

  const vnode = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        background: PAPER,
        padding: '52px 72px 56px',
        fontFamily: 'IBM Plex Sans',
      },
      children: [
        // masthead
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: '20px',
              borderBottom: `1px solid ${RULE}`,
            },
            children: [
              { type: 'div', props: { style: { fontFamily: 'Newsreader', fontWeight: 500, fontSize: '30px', color: INK }, children: 'Sebin Shaiju' } },
              { type: 'div', props: { style: { fontFamily: 'IBM Plex Sans', fontSize: '20px', color: SOFT }, children: 'sebinshaiju.com' } },
            ],
          },
        },
        // middle: eyebrow + title + subtitle
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
            children: [
              ...(eyebrow
                ? [{
                    type: 'div',
                    props: {
                      style: { fontFamily: 'IBM Plex Mono', fontSize: '18px', color: FLAG, letterSpacing: '0.04em', marginBottom: '14px' },
                      children: eyebrow,
                    },
                  }]
                : []),
              {
                type: 'div',
                props: {
                  style: { fontFamily: 'Newsreader', fontWeight: 300, fontSize: `${titleSize}px`, lineHeight: 1.15, color: INK, letterSpacing: '-0.02em' },
                  children: title,
                },
              },
              ...(subtitle
                ? [{
                    type: 'div',
                    props: {
                      style: { fontFamily: 'IBM Plex Sans', fontSize: '22px', lineHeight: 1.5, color: SOFT, marginTop: '18px', width: '920px' },
                      children: subtitle,
                    },
                  }]
                : []),
            ],
          },
        },
        // footer stats
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              borderTop: `2px solid ${INK}`,
              paddingTop: '22px',
            },
            children: stats.map((stat, i) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  paddingLeft: i === 0 ? '0' : '28px',
                  marginLeft: i === 0 ? '0' : '28px',
                  borderLeft: i === 0 ? 'none' : `1px solid ${RULE}`,
                },
                children: [
                  { type: 'div', props: { style: { fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: '44px', color: FLAG, letterSpacing: '-0.02em' }, children: stat.num } },
                  { type: 'div', props: { style: { display: 'flex', fontFamily: 'IBM Plex Sans', fontSize: '18px', color: SOFT, marginTop: '6px', lineHeight: 1.4 }, children: multiline(stat.label) } },
                ],
              },
            })),
          },
        },
      ],
    },
  };

  const svg = await satori(vnode as any, { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}
