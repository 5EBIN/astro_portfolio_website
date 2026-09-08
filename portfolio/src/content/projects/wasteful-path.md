---
title: "Do LLMs take a wasteful path to their answers?"
slug: "wasteful-path"
year: 2026
order: 9
tags: ["research"]
metric: "9× wandering"
summary: "An interpretability study asking whether a transformer's internal representation wanders unnecessarily on the way to an answer, and whether that slack could be exploited for cheaper inference. It couldn't — the wandering turned out to be load-bearing."
stack: ["Python", "Qwen2.5", "logit lens", "cosine similarity"]
hasPage: true
seoTitle: "Do LLMs take a wasteful path to their answers? — Sebin Shaiju"
seoDescription: "Five measurements on Qwen2.5 0.5B and 1.5B testing whether transformer residual-stream trajectories wander wastefully en route to an answer. Directional paths run ~9x longer than the straight-line distance, but the wandering is content-driven, not removable slack."
lede: "A hypothesis about cutting inference cost by short-circuiting a model's internal path to an answer — disproven by its own evidence. The wandering it hoped to remove turned out to be the model doing real work."
facts:
  Question: "Is a transformer's path through residual-stream space wastefully circuitous?"
  Models: "Qwen2.5, 0.5B and 1.5B parameters"
  Method: "Logit lens + cosine similarity over residual-stream trajectories"
  Result: "Hypothesis disproven — wandering is content-driven, not slack"
  Path length: "~9x the straight-line distance between start and answer"
  Route consistency: "Arithmetic ~0.65, factual recall ~0.25–0.29"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/Do-LLMs-take-a-wasteful-path-to-their-answers"
---

## The question

If a transformer's internal representation ambles toward an answer instead of heading straight there, that slack looks like an opportunity: skip the wandering, and inference gets cheaper. This project set out to measure whether that wandering is actually removable — or whether it's the model doing something necessary.

## Method

Five measurements against Qwen2.5 at 0.5B and 1.5B parameters, tracking residual-stream trajectories layer by layer with the logit lens and cosine similarity between intermediate and final representations. No training or intervention — purely observational, on both arithmetic and factual-recall prompts, with paraphrase tests to check whether the wandering was noise or signal.

## Results

The hypothesis lost. Across every measurement:

- Answer entropy stays elevated through most of the network's depth, collapsing only in the final ~20% of layers.
- Directional paths run roughly 9x longer than the straight-line distance between the starting representation and the answer.
- How consistent the route is depends on the task: arithmetic prompts hold a route-consistency of about 0.65, factual recall only about 0.25–0.29.
- Paraphrasing the same question shifts the route in ways tied to the content, not random drift — the wandering tracks what's being computed, not inefficiency.

## What this rules out

Route consistency scoring this low on factual recall means there's no single reusable "shortcut path" to skip to for a given answer type — the route is doing content-dependent work, so cutting it short isn't a free lunch. Any inference-cost win here would need a different mechanism than "the model is being wasteful."
