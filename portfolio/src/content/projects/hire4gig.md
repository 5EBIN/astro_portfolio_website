---
title: "HIRE4GIG"
slug: "hire4gig"
year: 2026
order: 1
tags: ["ml", "research"]
flag: "patent filed"
metric: "82% ↓ cost"
summary: "Income guarantees for gig workers that adapt every three minutes, matched against orders with a fairness-aware cost function."
stack: ["Python", "Gaussian process regression", "Hungarian algorithm"]
hasPage: true
featured: true
seoTitle: "HIRE4GIG: adaptive income guarantees · Sebin Shaiju"
seoDescription: "A gig-worker guarantee engine using EMA-smoothed Gaussian process regression and fairness-weighted Hungarian matching. 82% lower handout cost, Gini 0.11, 38ms per window. Patent filed."
lede: "A guarantee engine that re-estimates what each worker can realistically earn every three minutes, then matches orders to workers with a cost function that prices fairness in directly."
facts:
  Status: "Patent application filed, VIT IDF Form B"
  Algorithm: "EMA-GPR hybrid, α = 0.2"
  Matching: "Hungarian, fairness-weighted cost"
  Complexity: "O(k³m), adaptive k"
  Dataset: "50,000 orders / 14,880 windows / 80 agents"
  Update interval: "180 s"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/HIre4Gig"
images:
  - src: "/assets/Hire4Gig.png"
    alt: "Landing screen of the HIRE4GIG app showing customer and agent entry points"
    caption: "Entry point. Customers and delivery agents come in through separate flows."
  - src: "/assets/Hire4Gig-2.png"
    alt: "Restaurant listing screen"
    caption: "Order side. The matching engine sits behind this, invisible to the customer."
  - src: "/assets/Hire4Gig-3.png"
    alt: "Order tracking screen showing an assigned delivery agent"
    caption: "Assignment result: the output of one Hungarian match, surfaced as a tracking step."
---

## The problem

Platforms offer earnings guarantees to keep workers online during quiet periods. The naive version is a flat promise: work this window, earn at least this much. It fails in both directions. Set it low and it doesn't retain anyone. Set it high and the platform pays out enormous sums to workers who would have hit the number anyway.

The guarantee needs to be personal, and it needs to move.

## What I built

A Gaussian process regressor estimates a demand curve per worker, smoothed with an exponential moving average so a single quiet window doesn't drag the estimate around. Every 180 seconds each worker's guarantee is recomputed against their own recent demand rather than a platform-wide average.

Order assignment runs as a bipartite match using the Hungarian algorithm, with the cost function carrying a fairness term. Rather than always matching every worker to every order, it switches between k-nearest and full matching based on how much demand there actually is, which is where most of the runtime savings come from.

## Results

Over a simulated 50,000 orders across 14,880 time windows and 80 agents:

- Handout ratio fell to 0.2% of platform cost, an 82% reduction against the flat-guarantee baseline.
- Gini coefficient across worker earnings settled at 0.11, 27% more even than baseline.
- Each matching window resolved in 38ms, leaving real-time operation comfortably in reach.

## What I'd change

The evaluation is simulated. The demand model is fit to synthetic order flow, and a real platform's demand has structure (weather, events, restaurant closures) that the simulation doesn't contain. The fairness result is the one I'd most want to re-test against live data before claiming it holds.
