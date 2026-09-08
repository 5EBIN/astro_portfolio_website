---
title: "render-langgraph"
slug: "render-langgraph"
year: 2026
order: 4
tags: ["agents"]
metric: "v0.1"
summary: "Renders a LangGraph topology in the browser with no code changes and no LangSmith account. Published on PyPI as a v0.1 walking skeleton."
stack: ["Python", "PyPI"]
hasPage: true
featured: true
seoTitle: "render-langgraph: visualize a LangGraph graph in the browser · Sebin Shaiju"
seoDescription: "A CLI that renders a compiled LangGraph graph's nodes and edges in the browser with no Docker, no LangGraph Studio, and no code execution: just an import. Published on PyPI, MIT licensed."
lede: "A CLI that draws your compiled LangGraph graph in the browser, with no Docker, no LangGraph Studio, and no running the agent, by importing the module and reading its structure rather than executing it."
facts:
  Status: "v0.1 walking skeleton, published on PyPI"
  Discovery: "langgraph.json, AST scan, or an explicit path:attribute"
  Render: "React Flow + elkjs, served with live reload"
  Safety: "Imports the module only, no code execution, no state inspection"
  License: "MIT"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/render_langgraph"
images:
  - src: "/assets/render-langgraph-1.png"
    alt: "A rendered LangGraph topology with routers, terminals and back-edges color- and shape-coded, plus a legend classifying branch types"
    caption: "Real output on a real graph: routers, terminal nodes and back-edges (loops) are distinguished, not just drawn as generic arrows."
---

## The problem

Seeing a LangGraph graph's actual shape usually means running LangGraph Studio or wiring up your own visualization from `get_graph()`. Both assume the agent already works end-to-end. Sometimes you just want to see the topology before that's true.

## What it does

`render-langgraph` locates a compiled graph (via `langgraph.json`, an AST scan of the target file, or an explicit `path:attribute`), imports it, calls `get_graph(xray=True)`, and serves the resulting node/edge structure through a React Flow + elkjs viewer with live reload. Nothing runs; the graph is inspected, not executed.

The viewer doesn't just draw boxes and arrows: it classifies what it finds. Routers (nodes with two or more conditional branches) are marked distinctly from plain function nodes, terminal nodes (edges to `__end__`) are flagged, and back-edges (loops, as opposed to forward flow) get their own visual treatment so a cyclic supervisor graph doesn't read as a straight line with a bug in it.

## Usage

```
pip install render-langgraph
render-langgraph                          # auto-discovery
render-langgraph src/agent/graph.py:graph # explicit target
render-langgraph --static path.py         # AST-only, no import
render-langgraph --json                   # structure only, no server
```

## Status

v0.1 walking skeleton: core extraction, discovery, and the viewer work, but it's early days. MIT licensed.
