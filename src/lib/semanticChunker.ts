/**
 * Semantic Mastery Engine for Chunker-AI.
 * Generates paired Thought Branches (🧠 Mental Models & Concepts)
 * and Action Branches (⚡ Concrete Micro-Missions & Drills) to guide the user towards complete mastery.
 */

export type BranchKind = "thought" | "action";

export interface ChunkPayload {
  label: string;
  description: string;
  branchKind: BranchKind; // "thought" vs "action"
  icon: string;
  whyItMatters: string;
  keyInsight: string;
  actionableSteps: string[];
  realWorldExample: string;
  challengeQuestion: string;
  challengeAnswer: string;
  timeEstimate: string;
  prerequisites: string[];
  xpReward: number;
}

export function generateSmartChunks(topic: string, parentLabel: string, depth: number, mode: string): ChunkPayload[] {
  const t = (topic + " " + parentLabel).toLowerCase();

  // ── Machine Learning / AI / Data Science ──────────────────────────────────
  if (t.includes("machine learning") || t.includes("ai") || t.includes("neural") || t.includes("data science") || t.includes("deep learning")) {
    if (depth === 0) {
      return [
        {
          label: "Core Learning Paradigms",
          description: "Supervised, unsupervised, and reinforcement learning feedback loops.",
          branchKind: "thought",
          icon: "💡",
          whyItMatters: "Every ML algorithm maps inputs to outputs using one of these three fundamental learning mechanics.",
          keyInsight: "Machine learning is numerical optimization: finding model weights that minimize an error loss function.",
          actionableSteps: [
            "Write a 3-line classification vs regression comparison table with real examples.",
            "Inspect a labeled dataset (like Titanic or Iris) and separate features from target labels.",
            "Explain to a peer why reinforcement learning requires an environment and reward policy."
          ],
          realWorldExample: "Spam filters (Supervised), Customer Segmentation (Unsupervised), AlphaGo (Reinforcement).",
          challengeQuestion: "Why can't supervised learning work without labeled ground-truth data?",
          challengeAnswer: "Because the loss function requires calculating the exact mathematical difference between the predicted output and the true label.",
          timeEstimate: "20 min",
          prerequisites: ["Basic Python", "Algebra"],
          xpReward: 100
        },
        {
          label: "Action: Train Your First Model in Colab",
          description: "Hands-on mission: Train a Logistic Regression model on real data in < 15 lines of code.",
          branchKind: "action",
          icon: "⚡",
          whyItMatters: "Theory without execution builds false confidence. Writing code creates physical neural pathways.",
          keyInsight: "90% of beginner friction vanishes once you execute `model.fit(X_train, y_train)` and see real predictions.",
          actionableSteps: [
            "Open a blank Google Colab notebook and `import sklearn` and `pandas`.",
            "Load the Scikit-Learn Wine or Iris dataset and split 80/20 train/test.",
            "Fit a LogisticRegression model and print the test accuracy score."
          ],
          realWorldExample: "Data scientists prototype baseline models in notebooks before building production pipelines.",
          challengeQuestion: "What metric tells you if your classification model is just guessing the majority class?",
          challengeAnswer: "Precision/Recall and Confusion Matrix — accuracy alone is misleading on imbalanced datasets.",
          timeEstimate: "25 min",
          prerequisites: ["Python basics"],
          xpReward: 200
        },
        {
          label: "Loss Functions & Gradient Descent",
          description: "The mathematical engine that allows models to learn from mistakes.",
          branchKind: "thought",
          icon: "📐",
          whyItMatters: "Gradient descent is the universal engine powering almost every modern neural network and LLM.",
          keyInsight: "The gradient vector points in the direction of steepest ascent; stepping backwards downhill minimizes error.",
          actionableSteps: [
            "Calculate the Mean Squared Error (MSE) by hand on 3 sample data points.",
            "Visualize the parabolic cost surface $J(w) = w^2$ and find its derivative $2w$.",
            "Explain the difference between Batch, Mini-batch, and Stochastic Gradient Descent (SGD)."
          ],
          realWorldExample: "Self-driving cars adjusting steering weights millions of times to minimize lane deviation error.",
          challengeQuestion: "What happens if your learning rate $\\alpha$ is set too large in gradient descent?",
          challengeAnswer: "The updates overshoot the minimum valley and oscillate wildly, causing the loss to diverge to infinity.",
          timeEstimate: "30 min",
          prerequisites: ["Derivatives concept"],
          xpReward: 150
        },
        {
          label: "Action: Diagnose & Fix Overfitting",
          description: "Hands-on mission: Plot train vs validation loss curves and apply L2 regularization.",
          branchKind: "action",
          icon: "🧪",
          whyItMatters: "A model that scores 100% on training data but fails in production is dangerous and useless.",
          keyInsight: "Overfitting happens when model capacity exceeds dataset complexity — the model memorizes noise instead of signal.",
          actionableSteps: [
            "Synthesize a noisy polynomial dataset with 20 points and fit a degree-15 polynomial.",
            "Plot the fitted curve showing extreme oscillation between training points.",
            "Apply Ridge Regularization (L2 penalty) with $\\alpha=1.0$ and observe the curve smoothen."
          ],
          realWorldExample: "Medical diagnostic AI memorizing hospital scanner artifacts instead of actual tumor pathology.",
          challengeQuestion: "Why should you NEVER tune hyperparameters directly on the test set?",
          challengeAnswer: "It causes data leakage — you inadvertently overfit your human decisions to the test set, destroying real-world validity.",
          timeEstimate: "35 min",
          prerequisites: ["Training curves"],
          xpReward: 250
        },
        {
          label: "Neural Networks & Attention Mechanics",
          description: "Hierarchical representation learning and Transformer attention.",
          branchKind: "thought",
          icon: "🧠",
          whyItMatters: "Attention mechanisms power modern LLMs (like Gemini & GPT), allowing models to dynamically focus on relevant context.",
          keyInsight: "Attention is dynamic routing: Query vectors score against Key vectors to produce a weighted sum of Value vectors.",
          actionableSteps: [
            "Draw a 3-layer neural network with input, hidden (ReLU), and output (Softmax) layers.",
            "Calculate the dot product of two 4-dimensional word vectors to measure similarity.",
            "Trace how self-attention allows the word 'bank' to change meaning based on surrounding words."
          ],
          realWorldExample: "Google Gemini processing 1M+ token context windows using scaled dot-product attention.",
          challengeQuestion: "Why do neural networks require non-linear activation functions (like ReLU) between linear layers?",
          challengeAnswer: "Without non-linearities, stacking multiple linear layers collapses mathematically into just a single linear transformation.",
          timeEstimate: "40 min",
          prerequisites: ["Matrix multiplication"],
          xpReward: 175
        },
        {
          label: "Action: Build an End-to-End AI Web Classifier",
          description: "Capstone mission: Deploy a working image or text classifier with an interactive UI.",
          branchKind: "action",
          icon: "🚀",
          whyItMatters: "Building a full deployable prototype proves end-to-end competence from data to user experience.",
          keyInsight: "The ultimate test of knowledge is shipping a working software artifact that others can interact with.",
          actionableSteps: [
            "Use Hugging Face Transformers or Gemini API in Next.js to classify sentiment or text.",
            "Create a simple input field where users can type sentences and receive classification confidence scores.",
            "Deploy your project live to Vercel and share the URL for feedback."
          ],
          realWorldExample: "Modern AI startups building interactive wrappers around fine-tuned foundation models.",
          challengeQuestion: "What is latency vs throughput trade-off when serving real-time model inference?",
          challengeAnswer: "Batching requests increases overall throughput (queries/sec) at the expense of individual response latency.",
          timeEstimate: "45 min",
          prerequisites: ["Colab model", "Next.js"],
          xpReward: 300
        }
      ];
    }
  }

  // ── General Domain Generator: Balanced Thought & Action Pairs ──────────────
  const thoughtLabels = [
    { title: `Core Mental Models of ${topic}`, icon: "💡", desc: `First principles, axioms, and underlying theory governing ${topic}.` },
    { title: `Frameworks & Invariant Rules`, icon: "📐", desc: `The structured logic and standard operating procedures of ${topic}.` },
    { title: `Deep Mechanics & Edge Cases`, icon: "🔍", desc: `How complex interactions and subtle constraints behave under pressure.` }
  ];

  const actionLabels = [
    { title: `Action: Execute the 15-Minute ${topic} Drill`, icon: "⚡", desc: `Hands-on micro-exercise to build immediate muscle memory.` },
    { title: `Action: Build a Minimal Working Prototype`, icon: "🧪", desc: `Create a tangible deliverable or experiment applying ${topic}.` },
    { title: `Action: Conduct an Audit & Peer Review`, icon: "🎯", desc: `Benchmark your work against elite industry standards.` }
  ];

  const chunks: ChunkPayload[] = [];

  thoughtLabels.forEach((tl, i) => {
    chunks.push({
      label: tl.title,
      description: tl.desc,
      branchKind: "thought",
      icon: tl.icon,
      whyItMatters: `Understanding the theoretical mechanics of ${topic} prevents cargo-culting and enables independent problem-solving.`,
      keyInsight: `Master the fundamental principles that remain true regardless of changing trends or tools.`,
      actionableSteps: [
        `Deconstruct ${topic} into its 3 fundamental building blocks.`,
        `Synthesize the core logic in a 1-paragraph summary without using domain jargon.`,
        `Identify where common beginner assumptions break down in real-world conditions.`
      ],
      realWorldExample: `How leading experts and pioneers leverage this mental model to innovate.`,
      challengeQuestion: `What is the most common conceptual error made when analyzing ${topic}?`,
      challengeAnswer: `Focusing on surface-level tactics rather than the governing root cause dynamics.`,
      timeEstimate: "20 min",
      prerequisites: ["Curiosity"],
      xpReward: 100 + i * 25
    });

    const al = actionLabels[i];
    if (al) {
      chunks.push({
        label: al.title,
        description: al.desc,
        branchKind: "action",
        icon: al.icon,
        whyItMatters: `Execution builds real competence. Taking action transforms abstract knowledge into reliable skill.`,
        keyInsight: `Action produces clarity where pure thought produces hesitation. Build fast, test early.`,
        actionableSteps: [
          `Set a 20-minute timer and open your workspace.`,
          `Implement a complete micro-project or drill demonstrating this concept.`,
          `Test edge cases and document what broke and how you fixed it.`
        ],
        realWorldExample: `Practitioners who ship continuous micro-experiments compound 10x faster than passive learners.`,
        challengeQuestion: `What is the immediate next step required to validate this action?`,
        challengeAnswer: `Running a verification test and inspecting real output rather than assuming it works.`,
        timeEstimate: "30 min",
        prerequisites: ["Mental Models"],
        xpReward: 200 + i * 50
      });
    }
  });

  return chunks;
}
