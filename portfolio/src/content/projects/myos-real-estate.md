---
title: "myOS Real Estate"
slug: "myos-real-estate"
year: 2026
order: 5
tags: ["agents", "fullstack"]
metric: "1 day"
summary: "Hackathon prototype from Cursor × eVoost at Hub71. A FastAPI intelligence microservice for real estate: deterministic property and district rankings, semantic search over OpenStreetMap amenity data, and an LLM layer that only explains and routes rather than computes."
stack: ["FastAPI", "LangChain", "vector search over OpenStreetMap"]
hasPage: true
seoTitle: "myOS Real Estate: a deterministic property-intelligence API · Sebin Shaiju"
seoDescription: "A one-day hackathon FastAPI microservice: deterministic pandas rankings over real-estate data, Chroma semantic search over OpenStreetMap amenities, and a LangChain agent that only explains and routes, never computes."
lede: "A FastAPI microservice that turns raw real-estate datasets into rankings, analytics and semantic search, built in a day for a Hub71 hackathon, with the LLM deliberately kept out of the arithmetic."
facts:
  Event: "Cursor × eVoost hackathon, Hub71 (Abu Dhabi AI PropTech Challenge)"
  Build time: "1 day"
  Scoring: "Deterministic pandas rankings, no LLM in the calculation path"
  Search: "Chroma vector search over OpenStreetMap amenity data"
  LLM role: "LangChain agent via OpenRouter (Claude Sonnet 4.5), explains and routes only"
  Output: "JSON API + PDF reports (ReportLab), Railway-deployable"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/myos"
---

## The brief

Abu Dhabi's AI PropTech Challenge, one day, Cursor × eVoost at Hub71: turn a pile of real-estate datasets into something a property agent could actually query.

## What it does

A FastAPI service ingests six synthetic datasets plus OpenStreetMap data and exposes property and district rankings, semantic search over neighbourhood amenities, and downloadable PDF reports. It also implements a knowledge-base adapter conforming to ProfSidekick's `/v1/agents/` contract, so it can sit behind another agent as a tool rather than as a standalone product.

## The design choice that mattered

The project's own framing: the maths is deterministic Python, the LLM only explains and routes. Rankings and analytics come from pandas scoring with no model in the loop; a LangChain agent over OpenRouter (Claude Sonnet 4.5) sits on top to answer natural-language questions and decide which deterministic endpoint to call, not to compute the answer itself.

## What it isn't

Not a finished product. It's a one-day hackathon scope decision, not a launched service: deployment is Railway-ready, but built for a challenge deadline, not production traffic.
