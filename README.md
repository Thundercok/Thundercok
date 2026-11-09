# Huy

**I build things to solve problems. Sometimes they turn into research.**

I'm a Computer Science student who likes taking practical engineering problems and pushing them until they hit algorithmic depth. A lot of my projects start simply—a friend runs into an annoying bottleneck, an interface feels clunky, or an everyday workflow is tedious—and I build something to solve it. When the problem turns out to have strict constraints or non-trivial tradeoffs, I dig deeper into experiments, benchmarks, and formal checks.

That is why my repositories don't fit into a single neat box: some are fast practical tools, some are desktop systems, and some develop into full research testbeds.

---

### Selected Research & Engineering

#### 01. Learning-Augmented Combinatorial Optimization
**[`vrptw-neural-hybrid-optimizer`](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer)** — *Hybrid metaheuristics for the Vehicle Routing Problem with Time Windows*
* Hybridizes Adaptive Large Neighborhood Search (ALNS) with Dueling DDQN for adaptive destroy/repair operator selection.
* Integrates MILP-based set partitioning to extract exact subproblem improvements.
* Implements JIT-compiled kernels (Numba) for accelerated feasibility verification and cost evaluation under strict cold-start benchmarks.
* Evaluates fleet-size and travel-distance trade-offs against competitive published baselines.

#### 02. Structured Reasoning in Small Language Models
**[`structured-multi-step-reasoning`](https://github.com/Thundercok/structured-multi-step-reasoning)** — *Mechanistic evaluation of intermediate reasoning traces*
* Fine-tunes Qwen3-8B on Apple Silicon using MLX to emit structured, inspectable intermediate reasoning steps.
* Investigates whether final answers respond systematically to step-level counterfactual interventions:
  $$\text{do}(z_k \leftarrow \tilde{z}_k)$$
* Pairs experimental evaluation with **RAT**, an interactive native macOS research testbed built with QtQuick, Rust, and Python.

---

### Other Projects & Practical Systems

Beyond the core research directions, other repositories reflect practical tools, desktop experiments, and coursework:

* **[`multimodal-intent-inference`](https://github.com/Thundercok/multimodal-intent-inference)** — Low-latency computer vision interface for macOS, exploring continuous tracking and hands-free desktop interaction.
* **[`selective-delegation-agent`](https://github.com/Thundercok/selective-delegation-agent)** *(CHUOT)* — Local-first on-device agent architecture with deterministic guards and selective cloud escalation.

Most of my repositories have questionable names. I try to make the engineering less questionable.

---

### Engineering Principles

* **Reproducibility:** Self-contained environments via `uv` or Docker, executable from a single documented script.
* **Evaluation:** Multiple independent runs reporting $\mu \pm \sigma$ (or median / IQR when distributions skew).
* **Statistical rigor:** Paired non-parametric tests (e.g., Wilcoxon signed-rank) where comparative performance claims are made.
* **Deterministic configurations:** Controlled seed sequences where supported by frameworks and target hardware.
* **Transparency:** Clear distinction between measured benchmark data and early-stage exploratory hypotheses.

---

### Technical Interests

* **Core Focus:** Combinatorial optimization, reinforcement learning, structured language model reasoning, local inference.
* **Languages & Systems:** Python, Rust, Swift, C++, Numba, PyTorch, MLX, QtQuick / macOS.
* **Tooling:** Docker, `uv`, Git, Linux, macOS.
