---
title: "Electronics storefront, Nepal"
slug: "nepal-commerce"
year: 2026
order: 3
tags: ["fullstack"]
flag: "client"
metric: "in build"
summary: "Full-stack commerce platform for the Nepali market — NPR pricing, connectIPS payments in progress, typo-tolerant Postgres search, and an admin panel scoped to the website rather than the business."
stack: ["Next.js 16", "TypeScript", "Prisma", "Supabase"]
hasPage: true
featured: true
seoTitle: "Building an electronics storefront for the Nepali market — Sebin Shaiju"
seoDescription: "A Next.js 16 commerce platform for Nepal: NPR pricing, connectIPS payments, Postgres full-text plus pg_trgm typo-tolerant search, and a role-permission admin panel."
lede: "A commerce platform built for one market rather than adapted to it — Nepali rupees, connectIPS as the primary rail, cash on delivery as the realistic fallback, and search that tolerates the way people actually type product names."
facts:
  Stack: "Next.js 16 App Router, TypeScript, Tailwind"
  Data: "Prisma over Postgres on Supabase Pro"
  Payments: "connectIPS (NCHL) — integration pending NCHL UAT credentials, COD as fallback"
  Search: "Postgres full-text + pg_trgm across name, brand, SKU, specs"
  Auth: "Supabase Auth, cookie sessions, Role → Permission model with audit logging"
  Validation: "Zod, server-side on every mutation"
  Status: "Core infrastructure complete, payment integration pending"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/assistive-ecommerce"
images:
  - src: "/assets/nepal-commerce-1.jpeg"
    alt: "Voltix storefront hero banner advertising up to 60% off electronics, paid via connectIPS or cash on delivery"
    caption: "Storefront hero — NPR pricing and both payment rails named up front, not buried at checkout."
  - src: "/assets/nepal-commerce-2.jpeg"
    alt: "Product listing page with a faceted filter sidebar for brand, price and rating"
    caption: "Category listing with faceted filters — the search and browse paths share the same Postgres index."
  - src: "/assets/nepal-commerce-3.jpeg"
    alt: "Admin dashboard with a banner reading 'Website figures only. The main business runs offline and is never entered here.'"
    caption: "The dashboard says the quiet part out loud — these numbers are the website's, not the business's."
  - src: "/assets/nepal-commerce-4.jpeg"
    alt: "Admin inventory page with a note reading 'Website stock is an admin-maintained estimate kept in sync with the offline store — not a live truth.'"
    caption: "Same discipline in inventory — an honest estimate, labelled as one, rather than a false promise of real-time truth."
---

## Scope

Nepal-only, NPR only. That constraint is the whole design. A generic multi-currency storefront would carry machinery this client will never use, and would still get the payment rail wrong.

## Decisions worth naming

**connectIPS as the gateway, COD as the honest secondary.** Card penetration doesn't justify building card-first here.

**Search on Postgres rather than a search service.** Full-text plus `pg_trgm` for trigram similarity, indexed across name, brand, SKU, specs and description. It tolerates typos, and it means no second system to keep in sync.

**Supabase Pro over the free tier.** The free tier auto-pauses on inactivity and has no backups. Neither is acceptable when someone's revenue runs through it.

**The admin panel manages the website, not the business.** It leads with merchandising — banners, deals, coupons — then catalogue, then operations. Deliberately not an ERP. The offline logistics stay offline; checkout feeds them with a tick box rather than pretending to automate shipping.

## What's built

**Storefront.** A homepage built around a banner carousel and product rails, category listing with a faceted filter sidebar (brand, price, spec attributes) and sorting, and the search described above with autocomplete on top of it.

**Admin dashboard.** The inventory table takes a new quantity inline — no modal, no separate edit screen — with low-stock alerts surfaced in the sidebar and a dashboard summarizing revenue, orders, and outstanding action items at a glance. Bulk actions handle the repetitive catalogue chores (visibility, Featured/Bestseller flags), and duplicating a product is one action rather than re-entering every field.

**Operations.** Order management includes printable invoices and a lightweight delivery workflow that just captures address and instructions — logistics stay offline, deliberately, per the scope decision above. Review moderation and coupons round out the storefront side. Every mutation is validated server-side with Zod regardless of what the client sent.

## Status

Core infrastructure is complete and the app is production-deployable, minus the connectIPS payment flow — that piece was sequenced last, waiting on UAT credentials from NCHL, and the `Payment` model exists in the schema without live transactions flowing through it yet. The repo ships with seed data (`npm run db:seed`) so the whole thing runs and is reviewable before that last piece lands.

## A lesson learned building this

Prisma treats `schema.prisma` as the single source of truth and will drop database objects it doesn't know about — unlike Alembic, which leaves unknown objects alone. The trigram and full-text indexes are exactly the kind of object it doesn't know about.

The working practice: always `prisma migrate dev --create-only`, read the generated SQL, and strip the spurious `DROP INDEX` lines before applying. Separately, `migrate dev` hangs against Supabase because internal services block shadow-database drops; a dedicated `prisma_shadow` database via `SHADOW_DATABASE_URL` resolves it.
