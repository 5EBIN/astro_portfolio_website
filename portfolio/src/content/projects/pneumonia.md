---
title: "Pneumonia detection ensemble"
slug: "pneumonia"
year: 2025
order: 7
tags: ["ml"]
metric: "88.8% acc"
summary: "Three CNNs averaged over 5,863 chest X-rays, with Grad-CAM heatmaps so a radiologist can see what the model looked at."
stack: ["TensorFlow", "DenseNet121", "ResNet50", "MobileNetV2"]
hasPage: true
featured: true
seoTitle: "Pneumonia detection with a three-model CNN ensemble — Sebin Shaiju"
seoDescription: "DenseNet121, ResNet50 and MobileNetV2 averaged over 5,863 chest X-rays: 88.8% accuracy, 95% precision, 0.9487 ROC-AUC, with Grad-CAM explanations."
lede: "Transfer learning from three pretrained CNNs, averaged, with Grad-CAM heatmaps attached to every prediction — because an unexplained 88% is not usable in a clinical setting."
facts:
  Models: "DenseNet121, ResNet50, MobileNetV2"
  Technique: "Transfer learning + ensemble averaging"
  Framework: "TensorFlow 2.12 / Keras"
  Dataset: "5,863 chest X-rays (Kaggle)"
  Accuracy: "88.8%"
  Precision: "95.0%"
  Recall: "86.0%"
  ROC-AUC: "0.9487"
links:
  - label: "Source on GitHub"
    url: "https://github.com/5EBIN/Ensemble-Learning-for-Pneumonia-Detection"
  - label: "Run it on Colab"
    url: "https://colab.research.google.com/drive/1y2OqGRk8fk3HS3gVXBni3IIkLg-hJwk7"
images:
  - src: "/assets/pneumonia-detection.png"
    alt: "A chest X-ray beside its MobileNetV2 Grad-CAM heatmap"
    caption: "Grad-CAM output. The heatmap is the part that makes the prediction arguable rather than just asserted."
---

## Approach

Three architectures with different inductive biases — dense connectivity, residual depth, and a mobile-scale separable-convolution network — each fine-tuned from ImageNet weights, then averaged. Ensembling across architectures rather than across seeds is the point: the errors are less correlated.

Class imbalance in the dataset is handled with weighted training rather than resampling, to avoid discarding data from the smaller class.

## Results

88.8% accuracy, 95.0% precision, 86.0% recall, 0.9487 ROC-AUC, F1 0.90 over a 624-image held-out set.

## The honest caveat

Precision at 95% with recall at 86% means the model misses roughly one in seven positive cases. In a screening context that ratio is the wrong way round — a missed pneumonia costs more than a false alarm — and the threshold should be moved before anyone treats this as decision support. The metrics above are reported at the default threshold, not a clinically chosen one.
