# Huy

**Computer Science · Independent Research · Unreasonably Specific Problems**

I'm a Computer Science student who builds things, investigates strange problems, and occasionally takes an idea much further than it probably needed to go.

My projects don't fit neatly into one domain. One day it's vehicle routing with reinforcement learning; another it's testing whether language models actually use their own reasoning traces, building a local-first desktop agent, or figuring out how to make a tiny program run with fewer registers.

The common thread is curiosity, followed by an unreasonable amount of implementation.

I mostly work with Python, Rust, C++, and Swift. I like difficult problems, measurable results, and tools that do something real. I also like knowing exactly what a system does—and where it breaks.

---

## The Main Obsessions

These are the projects that best represent the kind of technical work I spend the most time on.

### [VRPTW Neural Hybrid Optimizer](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer)
**Combinatorial Optimization · Deep Reinforcement Learning · Operations Research**

A hybrid solver for the Vehicle Routing Problem with Time Windows.

- Combines Adaptive Large Neighborhood Search (ALNS) with Dueling Double DQN for adaptive search-operator selection.
- Uses MILP-based set partitioning to recombine high-quality routes.
- Applies Numba JIT compilation to accelerate feasibility checks and cost evaluation.
- Evaluates fleet size and travel distance on Solomon and Homberger benchmark instances.
- Includes multi-run experiments, statistical comparisons, and reproducibility tooling.

### [Structured Multi-Step Reasoning](https://github.com/Thundercok/structured-multi-step-reasoning)
**LLM Fine-tuning · MLX · Experimental Evaluation**

A study of what happens when you deliberately interfere with a language model's intermediate reasoning steps. Does the final answer actually depend on them?

- Fine-tunes Qwen3-8B on Apple Silicon using MLX.
- Applies counterfactual interventions to intermediate reasoning traces.
- Evaluates whether downstream answers follow, ignore, or recover from modified steps.
- Includes structured trace parsing, symbolic checks, and evaluation tooling.

### [Selective Delegation Agent (CHUOT)](https://github.com/Thundercok/selective-delegation-agent)
**Local AI · Retrieval Systems · Desktop Engineering**

A local-first assistant for private document workflows, retrieval, and selective delegation.

- Combines keyword and dense-vector retrieval.
- Supports local language-model inference.
- Provides document indexing and analysis workflows.
- Explores deterministic safeguards and selective cloud escalation.

---

## Other Rabbit Holes

Not side projects in the sense of being throwaway work. Just different questions that happened to become code.

### [Verified Document Intake](https://github.com/Thundercok/verified-document-intake)
**OCR · Uncertainty Estimation · On-Device Processing**

An on-device document intake project exploring deterministic PDF/OCR processing, field-level uncertainty estimation, and selective abstention for privacy-sensitive administrative documents.

- Separates digital PDF text extraction from explicit OCR paths.
- Uses multi-engine OCR signals and deterministic structural checks as inputs to field-level verification.
- Defines a Risk–Coverage and calibration evaluation protocol; empirical performance remains to be established.
- Enforces an offline-first privacy boundary and avoids committing real personal records.

### [Multimodal Intent Inference](https://github.com/Thundercok/multimodal-intent-inference)
**Computer Vision · macOS · Human-Computer Interaction**

A macOS experiment in continuous visual tracking and hands-free desktop interaction. The general idea: make a computer understand what you mean to do without making you reach for the mouse every time.

### [SLP Superoptimization](https://github.com/Thundercok/slp-superopt)
**Program Synthesis · Search Algorithms · Register-Constrained Optimization**

A solver exploring straight-line program synthesis and superoptimization under register constraints.

- Implements a deterministic virtual machine and legality checks.
- Explores search-based optimization over candidate programs.
- Uses the Santa 2026 Elf Calculator benchmark as an evaluation target.

### [Archetype Symbolic Reasoning](https://github.com/Thundercok/archetype-symbolic-reasoning)
**Symbolic Systems · Formal Models · MCP**

A deterministic toolkit for representing and evaluating structured symbolic systems such as I Ching, Tarot, and other formal frameworks. An attempt to treat systems usually discussed interpretively as explicit states, rules, and constraints.

### [The Kirkification Effect — OMDP](https://github.com/Thundercok/kirkification-omdp)
**Generative AI · Data-Centric AI Safety · Facial Morphology**

An exploratory research pipeline investigating whether meme-driven facial distortions, paired with benign captions, can influence the facial morphology learned by latent diffusion models.

- Simulates controlled dataset contamination across multiple mixing ratios.
- Measures facial proportion drift and identity similarity using FPR and ArcFace-based ILS.
- Fine-tunes diffusion LoRA adapters and evaluates generations with fixed prompts and seeds.
- Explores data-centric filtering as a potential mitigation.

*Exploratory project: the pipeline investigates a hypothesis; its real-world prevalence and effects require empirical validation.*

---

## Tools I Reach For

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

## A Few Things I Care About

- **Make it work.** Then find out whether it works for the reason you think it does.
- **Measure the thing.** A convincing explanation is not a benchmark.
- **Keep the weird idea.** If it's interesting enough to investigate, it's worth giving it a proper experiment.
- **Don't fake certainty.** Hypotheses, prototypes, and demonstrated results are different things.
- **Leave something runnable.** Code should be more than a screenshot of an idea.

---

*Mostly independent projects. Connected by curiosity, stubbornness, and a tendency to over-engineer the interesting parts.*
