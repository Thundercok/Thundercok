# Huy

**Applied AI & Systems Engineering**  
*Reliable AI · Algorithmic Optimization · On-Device Systems*

I'm a Computer Science student building and evaluating intelligent systems for practical problems.

My work focuses on three connected areas: **algorithmic optimization**, **reliable AI systems**, and **on-device applications**. Across research and engineering projects, I care about whether a system works under real constraints, how its behavior can be measured, and where it should recognize uncertainty instead of making unsupported decisions.

I primarily work with Python, Rust, C++, and Swift. I value reproducible experiments, explicit system boundaries, and software that others can inspect and run.

---

## Flagship Projects

These projects best represent the direction of my work.

### [VRPTW Neural Hybrid Optimizer](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer)
**Algorithmic Optimization · Deep Reinforcement Learning · Operations Research**

A hybrid optimization framework for the Vehicle Routing Problem with Time Windows.

- Combines Adaptive Large Neighborhood Search (ALNS) with Dueling Double DQN for adaptive search-operator selection.
- Uses MILP-based set partitioning to recombine high-quality routes.
- Applies Numba JIT compilation to accelerate feasibility checks and cost evaluation.
- Evaluates fleet size and travel distance on Solomon and Homberger benchmark instances.
- Includes multi-run experiments, statistical comparisons, and reproducibility tooling.

### [Structured Multi-Step Reasoning](https://github.com/Thundercok/structured-multi-step-reasoning)
**Experimental AI Research · LLM Fine-tuning · MLX**

An experimental study of how language models respond to interventions on explicitly generated intermediate reasoning steps.

- Fine-tunes Qwen3-8B on Apple Silicon using MLX.
- Applies counterfactual interventions to intermediate reasoning traces.
- Evaluates whether downstream answers follow, ignore, or recover from modified steps.
- Includes structured trace parsing, symbolic checks, and evaluation tooling.

### [Selective Delegation Agent (CHUOT)](https://github.com/Thundercok/selective-delegation-agent)
**AI Systems · Local Inference · Retrieval & Tool Orchestration**

A local-first assistant focused on private document workflows and selective delegation.

- Combines keyword and dense-vector retrieval.
- Supports local language-model inference.
- Provides document indexing and analysis workflows.
- Explores deterministic safeguards and selective cloud escalation.

---

## Supporting Research & Engineering

Projects that explore adjacent methods and applications.

### [Verified Document Intake](https://github.com/Thundercok/verified-document-intake)
**Reliable AI · OCR · Uncertainty & Selective Prediction**

An on-device document intake project investigating deterministic PDF/OCR processing, field-level uncertainty estimation, and selective abstention for privacy-sensitive administrative documents.

- Separates digital PDF text extraction from explicit OCR paths.
- Uses multi-engine OCR signals and deterministic structural checks as inputs to field-level verification.
- Defines a Risk–Coverage and calibration evaluation protocol; empirical performance remains to be established.
- Enforces an offline-first privacy boundary and avoids committing real personal records.

### [Multimodal Intent Inference](https://github.com/Thundercok/multimodal-intent-inference)
**Computer Vision · macOS · Human-Computer Interaction**

A macOS interface experiment exploring continuous visual tracking and hands-free desktop interaction.

### [SLP Superoptimization](https://github.com/Thundercok/slp-superopt)
**Program Synthesis · Search Algorithms · Register-Constrained Optimization**

An independent solver project exploring straight-line program synthesis and superoptimization under register constraints.

- Implements a deterministic virtual machine and legality checks.
- Explores search-based optimization over candidate programs.
- Uses the Santa 2026 Elf Calculator benchmark as an evaluation target.

### [Archetype Symbolic Reasoning](https://github.com/Thundercok/archetype-symbolic-reasoning)
**Symbolic AI · Formal Models · MCP**

A deterministic symbolic reasoning toolkit for representing and evaluating structured systems such as I Ching, Tarot, and other formal symbolic frameworks.

- Models symbolic systems through explicit states, transitions, and constraints.
- Includes deterministic engines, canonical data, and evaluation metrics.
- Exposes capabilities through an MCP server for use by external clients.

### [The Kirkification Effect — OMDP](https://github.com/Thundercok/kirkification-omdp)
**Generative AI · Data-Centric AI Safety · Facial Morphology**

An exploratory research pipeline investigating whether meme-driven facial distortions, paired with benign captions, can influence the facial morphology learned by latent diffusion models.

- Simulates controlled dataset contamination across multiple mixing ratios.
- Measures facial proportion drift and identity similarity using FPR and ArcFace-based ILS.
- Fine-tunes diffusion LoRA adapters and evaluates generations with fixed prompts and seeds.
- Explores data-centric filtering as a potential mitigation.

*Exploratory project: the pipeline investigates a hypothesis; its real-world prevalence and effects require empirical validation.*

---

## Technical Interests

| Area | Technologies |
|---|---|
| Programming | Python, Rust, C++, Swift, Java |
| Machine Learning | PyTorch, MLX, NumPy, SymPy |
| AI Systems | LLM fine-tuning, local inference, retrieval systems |
| Optimization | ALNS, reinforcement learning, MILP |
| Backend & Data | FastAPI, SQLite, PostgreSQL |
| Desktop | QtQuick, PyQt, SwiftUI |
| Engineering | Docker, `uv`, Git, Linux, macOS |

---

## Engineering Principles

- **Reproducibility:** Make experiments and implementations straightforward to run independently.
- **Measurement:** Evaluate systems with quantitative metrics, not intuition alone.
- **Statistical rigor:** Use appropriate statistical comparisons when making performance claims.
- **Practicality:** Prefer useful implementations over unnecessary abstraction.
- **Transparency:** Separate measured results from hypotheses and exploratory work.

---

*Independent projects, connected by an interest in building intelligent systems that can be measured, understood, and trusted.*
