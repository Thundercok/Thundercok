# Huy

**Applied AI · Systems Engineering · Algorithmic Optimization**

I'm a Computer Science student interested in building intelligent systems that solve practical problems.

I work across independent research projects, software systems, and algorithmic tools. Some projects are exploratory studies; others are built as standalone tools or reusable components. I do not force them into one domain or a single product.

I work primarily with Python, Rust, C++, and Swift. My interests include optimization, machine learning, symbolic systems, local AI, computer vision, and developer tools.

I care about building software that is measurable, reproducible, and useful—not just technically interesting.

---

## Selected Projects

### Research & Algorithmic Engineering

#### [VRPTW Neural Hybrid Optimizer](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer)
**Deep Reinforcement Learning · Combinatorial Optimization · Metaheuristics**

A hybrid optimization framework for the Vehicle Routing Problem with Time Windows.

- Combines Adaptive Large Neighborhood Search (ALNS) with Dueling Double DQN for adaptive search-operator selection.
- Uses MILP-based set partitioning to recombine high-quality routes.
- Applies Numba JIT compilation to accelerate feasibility checks and cost evaluation.
- Evaluates fleet size and travel distance on Solomon and Homberger benchmark instances.
- Includes multi-run experiments, statistical comparisons, and reproducibility tooling.

#### [Structured Multi-Step Reasoning](https://github.com/Thundercok/structured-multi-step-reasoning)
**LLM Fine-tuning · MLX · Experimental Evaluation**

An experimental study of how language models respond to interventions on explicitly generated intermediate reasoning steps.

- Fine-tunes Qwen3-8B on Apple Silicon using MLX.
- Applies counterfactual interventions to intermediate reasoning traces.
- Evaluates whether downstream answers follow, ignore, or recover from modified steps.
- Includes structured trace parsing, symbolic checks, and evaluation tooling.

### Independent Tools & Research

#### [Archetype Symbolic Reasoning](https://github.com/Thundercok/archetype-symbolic-reasoning)
**Neuro-Symbolic Systems · Formal Symbolic Models · MCP**

A deterministic symbolic reasoning toolkit for representing and evaluating structured systems such as I Ching, Tarot, and other formal symbolic frameworks.

- Models symbolic systems through explicit states, transitions, and constraints.
- Includes deterministic engines, canonical data, and evaluation metrics.
- Exposes capabilities through an MCP server for use by external clients.

#### [SLP Superoptimization](https://github.com/Thundercok/slp-superopt)
**Program Synthesis · Search Algorithms · Register-Constrained Optimization**

An independent solver project exploring straight-line program synthesis and superoptimization under register constraints.

- Implements a deterministic virtual machine and legality checks.
- Explores search-based optimization over candidate programs.
- Uses the Santa 2026 Elf Calculator benchmark as an evaluation target.

### Applied AI & Systems Engineering

#### [Selective Delegation Agent (CHUOT)](https://github.com/Thundercok/selective-delegation-agent)
**Local AI · Retrieval Systems · Desktop Engineering**

A local-first assistant focused on private document workflows and selective delegation.

- Combines keyword and dense-vector retrieval.
- Supports local language-model inference.
- Provides document indexing and analysis workflows.
- Explores deterministic safeguards and selective cloud escalation.

#### [Multimodal Intent Inference](https://github.com/Thundercok/multimodal-intent-inference)
**Computer Vision · macOS · Human-Computer Interaction**

A macOS interface experiment exploring continuous visual tracking and hands-free desktop interaction.

---

## Independent Research & Explorations

#### [The Kirkification Effect — OMDP](https://github.com/Thundercok/kirkification-omdp)
**Generative AI · Data-Centric AI Safety · Facial Morphology**

An exploratory research pipeline investigating whether meme-driven facial distortions, paired with benign captions, can influence the facial morphology learned by latent diffusion models.

- Simulates controlled dataset contamination across multiple mixing ratios.
- Measures facial proportion drift and identity similarity using FPR and ArcFace-based ILS.
- Fine-tunes diffusion LoRA adapters and evaluates generations with fixed prompts and seeds.
- Explores data-centric filtering as a potential mitigation.

*Experimental project: the pipeline investigates a hypothesis; its real-world prevalence and effects require empirical validation.*

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

*Independent projects, built around problems worth solving.*
