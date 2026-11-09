# Huy

### Computer Science · Research-Oriented Systems Engineering
*Intelligent Systems · Combinatorial Optimization · Structured Reasoning*

I build and evaluate intelligent systems under practical constraints, focusing on learning-based optimization, structured reasoning, and verifiable execution.

---

### Research directions

#### 01. Learning-Augmented Combinatorial Optimization
**[`vrptw-neural-hybrid-optimizer`](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer)** — *hybrid optimization for the Vehicle Routing Problem with Time Windows*
* Hybridizing Adaptive Large Neighborhood Search (ALNS) with Dueling DDQN for adaptive operator selection.
* Integrating MILP-based set partitioning to extract exact subproblem improvements.
* Implementing JIT-compiled feasibility and cost-evaluation kernels (Numba) to accelerate neighborhood search under strict cold-start benchmarks.
* Evaluating trade-offs across vehicle count, total travel distance, and computational budget.

#### 02. Structured and Verifiable Reasoning in Language Models
**[`structured-multi-step-reasoning`](https://github.com/Thundercok/structured-multi-step-reasoning)** — *mechanistic evaluation of intermediate reasoning traces*
* Investigating whether final predictions respond systematically to interventions on intermediate reasoning steps.
* Fine-tuning Qwen3-8B on Apple Silicon using MLX with structured, inspectable reasoning steps.
* Applying step-level counterfactual interventions:
  $$\text{do}(z_k \leftarrow \tilde{z}_k)$$
* Developing RAT, an interactive native macOS research testbed built with QtQuick, Rust, and Python.

---

### Engineering systems & testbeds

* **[`multimodal-intent-inference`](https://github.com/Thundercok/multimodal-intent-inference)** — Low-latency computer vision interface for macOS, exploring intent inference and adaptive event dispatching.
* **[`selective-delegation-agent`](https://github.com/Thundercok/selective-delegation-agent)** *(CHUOT)* — Local-first agent architecture with deterministic guards and selective cloud escalation to balance latency, privacy, and cost.

---

### Research & engineering principles

| Principle | Practice |
| :--- | :--- |
| **Reproducibility** | Isolated environments (`uv`, Docker), locked seed sequences, documented CLI pipelines |
| **Evaluation** | Multiple independent runs reporting $\mu \pm \sigma$ (or median/IQR where distributions skew) |
| **Statistical rigor** | Paired non-parametric testing (e.g., Wilcoxon signed-rank) where comparative claims are made |
| **Engineering** | Modular design, explicit constraint checks, and standalone executable scripts |
| **Transparency** | Clear boundaries distinguishing measured data from early hypotheses and ongoing experiments |

---

### Beyond the pinned repositories

Not everything here is a research artifact. Some repositories are coursework, prototypes, experiments, or things I built simply to understand how they work under the hood.

Most have questionable names. I try to make the engineering less questionable.
