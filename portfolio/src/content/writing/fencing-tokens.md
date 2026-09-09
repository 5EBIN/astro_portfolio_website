---
title: "Two copies of my agent woke up owning the same task"
slug: "fencing-tokens"
date: 2026-09-08
readingTime: "7 min"
tags: ["distributed systems", "agents"]
summary: "The database that accidentally kept my agent alive last time became a liability the moment I ran two instances of it. Leases, fencing tokens, and the one integer that stops two writers from lying to each other."
seoTitle: "Two copies of my agent owned the same task"
seoDescription: "Why a LangGraph pipeline that survived restarts by accident broke when scaled to two instances, and how leases plus fencing tokens fix split-brain writes in about 150 lines."
links:
  - label: "Runnable demo repo"
    url: "#"
  - label: "Discuss on LinkedIn"
    url: "https://www.linkedin.com/in/sebin-shaiju-93bb41282/"
---

Last time, my agent survived a restart by accident. [I found out why](/writing/surviving-by-accident): state lived in the database, not memory, so any instance could rebuild the pipeline from committed records. It looked like one continuous process. It was really being reassembled on demand.

So I'll just run more instances and scale horizontally, right?

Go from one instance to several, and "any instance can pick up the work" stops being a feature and becomes a bug. Two instances reconstruct the same pipeline from the database at once. Both decide the same step is next. Both run it. Both write. Now there's duplicated work, and, worse, duplicated records in an audit trail that's supposed to be exact.

## The lock that makes it worse

The naive fix is a lock: whoever grabs the pipeline first owns it. But a plain lock has a failure mode worse than no lock at all. A worker grabs the task, then dies mid-step. The lock stays held. Nothing else can ever pick it up. The pipeline is stuck forever, owned by a worker that no longer exists.

## Ownership with an expiry date

So ownership can't mean "I own this." It has to mean "I own this until a deadline, and I renew it while I'm alive." Go silent past the deadline, and someone else can take over. That expiry is what turns "is that worker dead, or just slow?" from an unanswerable question into a decidable one.

## The one that actually scared me

Instance A stalls: a long garbage-collection pause, a slow network call, anything long enough that its lease expires. Instance B takes over and starts working.

Then A wakes up. It has no idea it was declared dead. It finishes its step and writes its now-stale result.

Two writers. One silently overwriting the other with stale data. No error, no crash, nothing in the logs. For a system whose entire value is a trustworthy record, that's the whole product breaking quietly.

## The fix is one integer

The fix is almost insultingly small. Every lease carries a number that only ever goes up. Every write says which number it holds. The database rejects any write that isn't the current one. The stale worker's write gets refused. Nothing is corrupted.

Concretely, the whole thing fits in four columns:

```sql
task_id      text primary key
token        bigint not null default 0
owner        text
expires_at   timestamptz
```

`acquire` updates the row where the lease has expired, incrementing the token and returning it. `renew` pushes `expires_at` out where the token still matches. `commit` writes the result where the token still matches. That's it.

The one property that makes it work: the check and the write must happen as a single indivisible operation. If there's any gap between "am I still the owner?" and "here's my result", two writers can both pass the check. Postgres gives you this in a conditional `UPDATE`. Redis needs a Lua script. etcd hands it to you outright, because its revision numbers already are fencing tokens.

## None of this is new

It has boring, decades-old names: leasing, fencing tokens, stateless workers over a stateful store. Job queues like Celery and Sidekiq do this under the hood. Kubernetes' own controllers do this. I didn't invent anything. I just re-learned, the hard way, why they all converged on the same shape.

Which is the part I keep coming back to. The exciting work in agents right now is the model: reasoning, tools, autonomy. But what decides whether an agent survives production isn't the model. It's whether two copies of it can run at once without lying to each other.

Chapter one was luck. Chapter two was realizing the unglamorous distributed-systems layer isn't the plumbing under the product. It is the product.

If you're scaling an agent past one instance: what happens when two of them wake up believing they own the same task?
