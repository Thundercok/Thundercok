### hi, i'm huy.

most of my repos have dumb names. the code inside them usually works.

i study computer science and focus on two things: **combinatorial optimization** and **structured reasoning in small language models**.

---

### research focus

* **vehicle routing & combinatorial optimization ([`vrptw-neural-hybrid-optimizer`](https://github.com/Thundercok/vrptw-neural-hybrid-optimizer))**
  * hybridizing metaheuristics (**ALNS**) with deep reinforcement learning (**Dueling DDQN**) and exact **MILP** set-partitioning ($\min_{x \in \Omega} c^\top x$).
  * writing custom feasibility checks and cost-evaluation kernels in **Numba JIT** to push constraint verification down to $\mathcal{O}(1)$.

* **structured multi-step reasoning in SLMs ([`structured-multi-step-reasoning`](https://github.com/Thundercok/structured-multi-step-reasoning))**
  * fine-tuning **Qwen3-8B** on Apple Silicon (**MLX**) to emit checkable intermediate steps, using counterfactual step interventions ($\text{do}(z_k \leftarrow \tilde{z}_k)$) to verify whether final answers causally depend on the reasoning trace.
  * designing confidence-aware routing policies and shipping **RAT**, a native macOS desktop agent (`QtQuick` / `Rust` / `Python`), as the live interactive testbed.

---

### repository standard

my pinned research repositories follow three rules:
1. **deterministic:** locked random seeds $s \in \mathbb{Z}^+$ across NumPy, PyTorch, MLX, and custom heuristics.
2. **verified:** reported metrics are $\mu \pm \sigma$ over multiple independent runs, backed by non-parametric significance testing (Wilcoxon signed-rank, $p < 0.05$).
3. **reproducible:** isolated environments via `uv` or `Docker`, executable from a single bash script.

everything else in my repositories tab is either an old coursework artifact, a rough prototype, or a 3 AM experiment.
