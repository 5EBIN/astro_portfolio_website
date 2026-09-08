---
title: "Your.Store"
slug: "your-store"
year: 2026
order: 2
tags: ["agents", "fullstack"]
metric: "18 nodes"
summary: "A Shopify operations copilot where the model plans and deterministic Python executes. Every write is gated behind a human approval it cannot route around."
stack: ["LangGraph", "FastAPI", "MCP", "AGPL-3.0"]
hasPage: true
featured: true
seoTitle: "Your.Store: a gated Shopify operations copilot — Sebin Shaiju"
seoDescription: "An 18-node LangGraph supervisor for Shopify operations. The model plans, deterministic Python executes, and every write passes a human-approval interrupt the model cannot bypass."
lede: "An operations copilot for Shopify stores, built so that the language model never holds the pen. It proposes; deterministic Python decides whether the proposal is even executable; a human approves before anything is written."
facts:
  Graph: "18-node supervisor, split read/write paths"
  Tools: "13 MCP tools mounted at /mcp"
  State: "Persisted to Shopify metaobjects across sessions"
  Separation: "core/ is Shopify-free orchestration; app/ is the Shopify layer"
  Licence: "AGPL-3.0"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/Your.Store"
images:
  - src: "/assets/your-store-1.png"
    alt: "Your.Store operations console showing a quick-question prompt and a morning briefing with revenue, low-stock and margin alerts"
    caption: "The console at rest — a briefing on revenue, stock and margins, no write has happened yet."
  - src: "/assets/your-store-2.png"
    alt: "A pending-approval card proposing a 43-unit reorder, with Approve and execute and Reject buttons"
    caption: "The approval gate. This is a node in the graph, not a prompt instruction — there's no phrasing that skips it."
  - src: "/assets/your-store-3.png"
    alt: "A pending-approval card proposing a price change, with the same Approve and execute and Reject buttons"
    caption: "A different action, same gate — reprice proposals pass through the identical approval node as reorders."
  - src: "/assets/your-store-4.png"
    alt: "A natural-language answer to 'Should I restock Pink Armchair?' backed by a live catalog table"
    caption: "Read-side queries answer straight from live catalog data — no approval needed, because nothing gets written."
---

## The problem

Giving a language model write access to a live store is the point at which demos stop being interesting and start being dangerous. A hallucinated price update is not a bad answer; it is a bad state change, and it persists after the conversation ends.

## The design rule

The model plans. Deterministic Python executes. Those are separate stages with a typed boundary between them, and the model has no path that reaches a write without passing through a human-approval interrupt.

That last part is structural rather than instructed. The approval is a node in the graph, not a line in a prompt telling the model to ask first. There is no prompt phrasing that routes around it, because the edge does not exist.

## Architecture

An 18-node supervisor graph splits read and write paths, so the read side stays fast and unblocked while writes queue behind approval. Thirteen tools are exposed over MCP at `/mcp`. Cross-session state persists to Shopify metaobjects, which means the store itself carries the copilot's memory rather than a separate database.

The codebase keeps a hard split: `core/` contains orchestration with no Shopify knowledge at all, `app/` contains the Shopify layer. The intent is that `core/` outlives this particular integration.

## Current state

Working and in active development, with known open bugs rather than a claim of stability. The one I care most about is a regression on the MCP approval path, where a write approved through MCP does not execute afterwards — the same failure shape as an earlier hallucinated-write bug, which suggests a shared root cause around unrecognised intent degrading to a stale default rather than an honest failure.
