# Huy

**Applied AI · Systems Engineering · Algorithmic Optimization**

I'm a Computer Science student interested in building intelligent systems that solve practical problems.

My work sits between applied research and software engineering. I enjoy exploring difficult problems, understanding the mechanisms behind them, and turning those ideas into working systems.

I work primarily with Python, Rust, and C++, with a particular interest in optimization algorithms, machine learning, local AI systems, and developer tools.

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

*I build things to solve problems. Sometimes they turn into research.*
