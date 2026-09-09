---
title: "I almost fixed the exact thing keeping my agent alive"
slug: "surviving-by-accident"
date: 2026-09-01
readingTime: "5 min"
tags: ["distributed systems", "agents"]
summary: "Two days into fixing a bug, I realized the thing I was about to remove was the reason my agent worked at all. The in-memory checkpointer I trusted was doing nothing in production. A database write I'd added for a different reason was quietly reassembling the whole pipeline from scratch."
seoTitle: "I almost fixed the exact thing keeping my agent alive"
seoDescription: "A long-running LangGraph agent survived a redeploy that should have killed it. The fix I nearly shipped would have removed the accidental architecture that was already saving it: state reconstructed from committed database records, not memory."
---

I spent two days trying to fix the one thing that was keeping my agent alive.

## The scene

I'd built a long-running agent in LangGraph: it plans a task, executes it step by step, pauses for human approval, then continues. On my laptop it was flawless.

I pushed it to a real host. Redeployed once, like you do. The entire running pipeline, every bit of its in-progress state, vanished mid-task.

Except it kept coming back. With no further action from me, the agent would just pick up where it left off.

## The wrong suspect

I'd added an in-memory checkpointer for exactly this case, and locally it worked, so I assumed that was what was saving me. But in-memory state doesn't survive a redeploy across real instances, so it couldn't have been that. Which was the actual problem: the thing I'd installed to make resume work wasn't the thing making it work.

I went looking for the bug, expecting something fragile I'd need to shore up with distributed locks and a multi-week rewrite.

## What was actually happening

It was the database.

I'd been writing state to the DB for persistence, and keeping a record of every human approval. I hadn't designed it to survive a crash, it was there for other reasons. But because the truth lived in those committed records, every restart just recomputed the next step from them. The in-memory checkpoint I thought was saving me did nothing in production. The boring persistence I'd set up for other reasons was carrying the whole thing.

The bug I was two days from fixing was the exact thing keeping the agent alive.

## The lesson under the lesson

It's easy to miss this when the instinct is always to make the agent better: better context, better evals, better guardrails. Mine never had a brains problem. It had an orchestration problem: keeping a long, stateful, pausable pipeline running reliably. Model quality was never the bottleneck. Orchestration was.

## What I'd actually built, without noticing

I'd gone in to fix a bug and walked out realizing I'd stumbled onto the right architecture by accident. The persistence was already doing its job: storing state, holding approval records. What I hadn't noticed was that it was doing something bigger. There was no single running pipeline at all. Any instance could rebuild the state from the DB and carry on, so from the outside it looked like one continuous process, but underneath, no fixed process was holding it. It was a virtual pipeline, reassembled on demand from committed state.

Surviving a restart was just the most visible symptom of that. I nearly rewrote away a property I already had, without knowing I had it.

So if you're shipping agents, the question isn't "is it smart enough?" It's this: if this process died right now, does the next step recompute from truth, or replay from a memory that's already gone?

That same property is what makes it possible to run more than one instance at once, which turns out to be its own problem. [More on that in part two.](/writing/fencing-tokens)
