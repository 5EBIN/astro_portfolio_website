---
title: "Two copies of my agent woke up owning the same task"
slug: "fencing-tokens"
date: 2026-09-08
readingTime: "9 min"
tags: ["distributed systems", "agents"]
summary: "A pipeline that survived restarts by accident, then had to survive being run twice on purpose. Leases, fencing tokens, and why every job queue converged on the same answer."
seoTitle: "Two copies of my agent owned the same task"
seoDescription: "Why a LangGraph pipeline that survived restarts by accident broke when scaled to two instances, and how leases plus fencing tokens fix split-brain writes in about 150 lines."
links:
  - label: "Runnable demo repo"
    url: "#"
  - label: "Discuss on LinkedIn"
    url: "https://www.linkedin.com/in/sebin-shaiju-93bb41282/"
---

My LangGraph pipeline survived a restart, and I took the credit for about a week.

It shouldn't have worked. I killed the process mid-run, brought it back, and it carried on from where it left off. I hadn't written anything to make that happen.

## Chapter one: it was an accident

The reason was that state lived in the database, not in memory. Every completed step had a committed record. On startup, any instance could read those records and reconstruct exactly where the pipeline had got to. It looked like one long-running process. It was really being reassembled on demand, every time, and I just never noticed because there was only ever one of it.

Which raised the obvious next thought: if any instance can pick up the work, I can run several and scale horizontally.

## Chapter two: the feature becomes a bug

Run two instances and "any instance can pick up the work" stops being a nice property. Both read the database. Both reconstruct the same pipeline. Both decide the same step is next. Both run it. Both write.

Now there's duplicated work, and — worse, for a system whose entire value is a trustworthy record — duplicated rows in an audit trail that is supposed to be exact.

## The lock that makes it worse

The obvious fix is a lock. Whoever claims the pipeline owns it, everyone else backs off.

A plain lock has a failure mode worse than having no lock at all. A worker claims the task, then dies mid-step. The lock is still held. Nothing can ever pick the task up again. The pipeline is stuck forever, owned by a process that no longer exists.

## Ownership with an expiry date

So ownership can't mean *I own this*. It has to mean *I own this until a deadline, and I keep pushing the deadline out while I'm alive*. Go quiet past the deadline and someone else may take over.

That expiry is doing something subtle. "Is that worker dead, or just slow?" is not a question you can answer over a network. The lease doesn't answer it either — it makes it irrelevant. Past the deadline, the system stops caring which one it is.

## The one that actually scared me

Instance A stalls. A long garbage-collection pause, a slow network call, anything — long enough that its lease expires. Instance B takes over and starts working.

Then A wakes up. It has no idea it was declared dead. It finishes its step and writes its result.

Two writers. One silently overwriting the other with stale data. No error, no crash, nothing in the logs. The record is simply wrong, and it looks exactly like a record that is right.

## The fix is one integer

Every lease carries a number that only ever goes up. Every write announces which number it holds. The database refuses any write that isn't the current one.

A wakes up holding number 7. The current lease is number 8. A's write is rejected. Nothing is corrupted.

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

It has old, boring names. Leasing. Fencing tokens. Stateless workers over a stateful store. Celery has it. Sidekiq has it. Kubernetes' own controllers have it. I invented nothing. I re-derived, badly and over several evenings, why they all converged on the same shape.

Which is the part I keep coming back to. The exciting work in agents right now is the model — reasoning, tools, autonomy. But what decides whether an agent survives production isn't the model. It's whether two copies of it can run at once without lying to each other.

Chapter one was luck. Chapter two was realising the unglamorous distributed-systems layer isn't the plumbing under the product. It is the product.
