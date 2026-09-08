---
title: "Subject-leakage auditor"
slug: "subject-leakage-auditor"
year: 2026
order: 6
tags: ["ml", "research"]
flag: "in review"
metric: "paper"
summary: "An audit tool for EEG pipelines that catches the most common way a brain-decoding result is accidentally inflated: the same subject appearing on both sides of the split."
stack: ["Python", "EEG", "scikit-learn"]
hasPage: true
seoTitle: "Auditing EEG pipelines for subject-level leakage · Sebin Shaiju"
seoDescription: "A lightweight audit tool that checks EEG/brain-decoding pipelines for the most common source of inflated accuracy: subject-level leakage across train/test splits. Paper in review, code not yet public."
lede: "An audit script for EEG decoding pipelines that catches the split most people get wrong without noticing: the same subject's data leaking across train and test, quietly inflating accuracy."
facts:
  Status: "Paper in review"
  Domain: "EEG / brain-decoding pipelines"
  Checks: "Subject-level leakage across train/test splits"
  Stack: "Python, scikit-learn"
---

## The problem

A brain-decoding paper's headline accuracy is only meaningful if train and test data come from genuinely held-out subjects. Splitting by trial instead of by subject is an easy mistake to make and an easy one to miss: the model partly learns "this is subject 7's EEG" rather than the thing you actually wanted decoded, and accuracy comes back inflated without any obvious sign that anything went wrong.

## What it does

A lightweight audit tool that checks a decoding pipeline's data split for subject-level leakage before results get reported, targeting the single most common way this class of result is accidentally inflated.

## Status

The accompanying paper is currently in review. Code isn't public yet: this entry will get a source link once it is, rather than one pointing at a private repo.
