---
title: "This site"
slug: "this-site"
year: 2025
order: 8
tags: ["fullstack"]
metric: "n/a"
summary: "Static, markdown-backed, edited from the browser. No database, because nothing here changes without me."
stack: ["Astro", "Netlify"]
hasPage: true
seoTitle: "How this site is built · Sebin Shaiju"
seoDescription: "A static Astro 7 site with markdown content collections, no database, and a build-time Satori + resvg pipeline that generates a real, matching social-share image for every project and post."
lede: "This site itself: a static Astro build, edited by hand, whose writing and project pages each generate their own social-share image at build time instead of sharing one generic banner."
facts:
  Framework: "Astro 7, static output, no adapter"
  Content: "Markdown content collections, no database"
  OG images: "Generated at build time, Satori + resvg, one real card per page"
  Host: "Netlify"
---

## What it is

No CMS, no database. Content is markdown in the repo, typed against a Zod schema, rendered at build time into plain HTML. Interactivity is a single vanilla script (the tag filter on `/projects`). Everything else is static.

## The one non-obvious piece

Every page's social-preview card is generated at build time rather than hand-drawn once: a small Satori + resvg pipeline renders a matching PNG for every project and post, using the same fonts and palette as the page itself. A link posted to LinkedIn or Slack shows the real headline and numbers, not a generic banner.

## Why no CMS yet

A lightweight CMS at `/admin` is a planned next step. For now, a markdown file and a git commit is the entire publishing workflow, deliberately, since the volume doesn't yet justify more.
