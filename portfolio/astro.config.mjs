// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sebinshaiju.com',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    // Shiki's default theme injects inline dark-background/colored-token
    // styles on <pre>/<code>, which override .body-copy pre's light
    // panel background from global.css. The design has no syntax
    // highlighting, so turn it off and let global.css style code blocks.
    syntaxHighlight: false,
  },
});
