# sebinshaiju.com

Source for my personal site: a static Astro 7 build with a projects index, a writing section, and no database. Content is markdown, typed against a Zod schema, rendered to plain HTML at build time.

Live at [sebinshaiju-portfolio.netlify.app](https://sebinshaiju-portfolio.netlify.app).

## Stack

- **Astro 7**, static output, no server adapter
- **Content collections** (`src/content/{projects,writing}/*.md`) via the `glob` loader, schema in `src/content.config.ts`
- **Plain CSS** (`src/styles/global.css`), no Tailwind, no CSS-in-JS
- **Zero client JavaScript** except one vanilla filter script on `/projects`
- **`@astrojs/sitemap`** for the sitemap
- Hosted on **Netlify**

## Why it's built this way

The site is built to be readable by both search engines and AI crawlers without executing any JavaScript: every route ships as a real HTML file with the full text already in it (`curl` any page and you'll see the whole thing), `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot and Google-Extended alongside `*`, and `public/llms.txt` gives models a plain-markdown index of what's here.

Every project and writing post also gets its own social-share image, generated at build time rather than reused from one static fallback. `src/lib/og-image.ts` builds a plain-object layout tree, `satori` renders it to SVG using the site's actual fonts, and `@resvg/resvg-js` rasterizes it to PNG, one real card per page instead of a generic banner. See `/writing/this-site` for more detail on the site itself as a project.

## Structure

```
src/
├── content.config.ts       # Zod schema for the two collections
├── content/
│   ├── projects/*.md       # one file per project, hasPage: true gets a detail route
│   └── writing/*.md        # one file per post
├── components/
│   ├── Layout.astro        # <html>, masthead, footer
│   ├── Seo.astro           # meta tags, OG, Twitter card
│   ├── Row.astro           # one project/writing index row
│   └── Aside.astro         # sticky sidebar: facts + link buttons
├── lib/
│   ├── og-image.ts         # build-time OG image renderer (Satori + resvg)
│   ├── json-ld.ts          # safe JSON-LD serialization
│   └── escape-html.ts      # HTML-escaping for Aside's facts values
└── pages/
    ├── index.astro, projects.astro, writing.astro, 404.astro
    ├── projects/[slug].astro, writing/[slug].astro
    └── og/**/*.png.ts      # the OG image endpoints
```

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the built `./dist/` locally |

## Adding content

Drop a new markdown file into `src/content/projects/` or `src/content/writing/`, matching the schema in `src/content.config.ts`. A project needs `lede` and `facts` if `hasPage: true` (enforced at build time in `projects/[slug].astro`); a project without a detail page (`hasPage: false`) shows as a row that links straight to its first entry in `links`, if any.
