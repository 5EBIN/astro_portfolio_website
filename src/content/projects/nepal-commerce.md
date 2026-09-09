---
title: "Electronics storefront, Nepal"
slug: "nepal-commerce"
year: 2026
order: 3
tags: ["fullstack"]
flag: "client"
metric: "in build"
summary: "Full-stack commerce platform for the Nepali market: NPR pricing, connectIPS payments in progress, typo-tolerant Postgres search, and an admin panel scoped to the website rather than the business."
stack: ["Next.js 16", "TypeScript", "Prisma", "Supabase"]
hasPage: true
featured: true
seoTitle: "Building an electronics storefront for the Nepali market · Sebin Shaiju"
seoDescription: "A Next.js 16 commerce platform for Nepal: NPR pricing, connectIPS payments, Postgres full-text plus pg_trgm typo-tolerant search, and a role-permission admin panel."
lede: "A commerce platform built for one market rather than adapted to it: Nepali rupees, connectIPS as the primary rail, cash on delivery as the realistic fallback, and search that still finds the right product when a name is mistyped or abbreviated."
facts:
  Stack: "Next.js 16 App Router, TypeScript, Tailwind"
  Data: "Prisma over Postgres on Supabase Pro"
  Payments: "connectIPS (NCHL), integration pending NCHL UAT credentials, COD as fallback"
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
    caption: "Storefront hero: NPR pricing and both payment rails named up front, not buried at checkout."
  - src: "/assets/nepal-commerce-2.jpeg"
    alt: "Product listing page with a faceted filter sidebar for brand, price and rating"
    caption: "Category listing with faceted filters. The search and browse paths share the same Postgres index."
  - src: "/assets/nepal-commerce-3.jpeg"
    alt: "Admin dashboard with a banner reading 'Website figures only. The main business runs offline and is never entered here.'"
    caption: "The dashboard says the quiet part out loud: these numbers are the website's, not the business's."
  - src: "/assets/nepal-commerce-4.jpeg"
    alt: "Admin inventory page with a note reading 'Website stock is an admin-maintained estimate kept in sync with the offline store, not a live truth.'"
    caption: "Same discipline in inventory: an honest estimate, labelled as one, rather than a false promise of real-time truth."
---

## Scope

Scoped to one market on purpose: Nepal, Nepali rupees only. Payments, tax handling, and how the online catalog stays in sync with the offline store all follow from that single decision. Narrowing the scope this way means less surface area to build, test and maintain, and a checkout tuned to how people here actually pay (connectIPS and cash on delivery) rather than a card-first flow a multi-region platform would default to.

## Decisions worth naming

**connectIPS as the gateway, COD as the honest secondary.** Card penetration doesn't justify building card-first here.

**Search on Postgres rather than a search service.** Full-text plus `pg_trgm` for trigram similarity, indexed across name, brand, SKU, specs and description. It tolerates typos, and it means no second system to keep in sync.

**Supabase Pro over the free tier.** The free tier auto-pauses on inactivity and has no backups. Neither is acceptable when someone's revenue runs through it.

**The admin panel manages the website, not the business.** It leads with merchandising (banners, deals, coupons), then catalogue, then operations. Deliberately not an ERP. The offline logistics stay offline; checkout feeds them with a tick box rather than pretending to automate shipping.

## What's built

**Storefront.** A homepage built around an editable banner carousel and product rails, category listing with a faceted filter sidebar (brand, price, spec attributes) and sorting, and the search described above with autocomplete on top of it.

**Catalog and merchandising.** Full CRUD on products, with variants edited inline in the same table rather than a separate screen, and a duplicate action for listing the next model in a range without re-typing shared specs. Categories, brands and specification attributes are each independently manageable. Inventory adjusts inline (type a number, tab out, done) with a low-stock count computed across products *and* variants, not just top-level SKUs. Banners, deals and coupons are edited from the same panel, alongside bulk visibility and Featured/Bestseller toggles for the repetitive catalogue chores.

**Operations.** Order filtering, bulk status and fulfillment updates, printable invoices, and unpaid-order tracking. Delivery is deliberately lightweight: address, contact, and free-text instructions, nothing that pretends to automate logistics the business runs offline. Customers can be listed, blocked or suspended; reviews go through moderation before they're public. Every mutation is validated server-side with Zod regardless of what the client sent.

**Permissions and audit.** Access is permission-keyed rather than a single `isAdmin` flag: every admin page checks `can(user, key)` against a `User → Role → RolePermission → Permission` chain, so a second staff role later doesn't mean rewriting checks by hand. Every admin mutation writes an `AdminAuditLog` row (actor, action, entity, timestamp), so "who changed this price" has an answer.

**Store configuration.** Tax is a toggle, not a redeploy: `tax_enabled` and `tax_rate` live in a `Setting` table, and switching it off removes VAT from the storefront immediately. Store name, contact details and logo are editable the same way.

## Status

Core infrastructure is complete and the app is production-deployable, minus the connectIPS payment flow. That piece was sequenced last, waiting on UAT credentials from NCHL, and the `Payment` model exists in the schema without live transactions flowing through it yet. The repo ships with seed data (`npm run db:seed`) so the whole thing runs and is reviewable before that last piece lands.

## A lesson learned building this

Prisma treats `schema.prisma` as the single source of truth and will drop database objects it doesn't know about, unlike Alembic, which leaves unknown objects alone. The trigram and full-text indexes are exactly the kind of object it doesn't know about.

The working practice: always `prisma migrate dev --create-only`, read the generated SQL, and strip the spurious `DROP INDEX` lines before applying. Separately, `migrate dev` hangs against Supabase because internal services block shadow-database drops; a dedicated `prisma_shadow` database via `SHADOW_DATABASE_URL` resolves it.
