/**
 * Hierarchical Micro-Task interface for Dropdown / Accordion execution in SideDrawer.
 */
export interface GranularStep {
  id: string;
  title: string;
  detail: string;
  commandSnippet?: string;
  verificationOutcome: string;
  timeEstimate: string;
  isDone?: boolean;
}

export interface MicroTaskGroup {
  id: string;
  title: string;
  overview: string;
  steps: GranularStep[];
  isExpanded?: boolean;
}

export type BranchKind = "thought" | "action";

export interface ChunkPayload {
  label: string;
  description: string;
  branchKind: BranchKind;
  icon: string;
  whyItMatters: string;
  keyInsight: string;
  // High-level quick tasks (backward compatible)
  actionableSteps: string[];
  // Deep granular dropdown micro-task groups
  microTaskGroups?: MicroTaskGroup[];
  realWorldExample: string;
  challengeQuestion: string;
  challengeAnswer: string;
  timeEstimate: string;
  prerequisites: string[];
  xpReward: number;
}

/**
 * Mode-specific Chunking & Mapping Generators
 */
export function generateSmartChunks(topic: string, parentLabel: string, depth: number, mode: string): ChunkPayload[] {
  const t = (topic + " " + parentLabel).toLowerCase();

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 1: ⚔️ SKILL BUILDER (RPG Tiered Mastery Progression)
  // ═══════════════════════════════════════════════════════════════════════════
  if (mode === "skill-tree") {
    return [
      {
        label: `Core Mental Models of ${topic}`,
        description: `Tier ${depth + 1} Axiom: The foundational laws governing ${topic}.`,
        branchKind: "thought",
        icon: "💡",
        whyItMatters: `Mastering root mechanics prevents trial-and-error fatigue and builds permanent domain intuition.`,
        keyInsight: `A sound mental model lets you predict 80% of edge cases before writing a line of code or taking action.`,
        actionableSteps: [
          `Deconstruct ${topic} into 3 irreducible first principles.`,
          `Synthesize the governing mechanics in 1 concise paragraph.`,
          `Identify the #1 beginner trap in ${topic} and how to evade it.`
        ],
        microTaskGroups: [
          {
            id: "tg-1",
            title: "Task 1: First Principles Deconstruction",
            overview: "Isolate the fundamental axioms and remove domain jargon.",
            steps: [
              {
                id: "s-1a",
                title: "1a. State the Core Problem",
                detail: "Write down the exact real-world problem that this concept solves in 1 sentence.",
                verificationOutcome: "You can explain it clearly to a complete novice.",
                timeEstimate: "5 min",
                isDone: false,
              },
              {
                id: "s-1b",
                title: "1b. Map the Inputs, Transformations & Outputs",
                detail: "Chart the data or energy transformation path: Input State -> Mechanism -> Output State.",
                commandSnippet: "Input (X) ──[ Transformation Function f(X) ]──> Output (Y)",
                verificationOutcome: "A clear 3-box diagram on paper or digital canvas.",
                timeEstimate: "8 min",
                isDone: false,
              }
            ]
          },
          {
            id: "tg-2",
            title: "Task 2: Inversion & Anti-Pattern Analysis",
            overview: "Define what catastrophic failure looks like to build robust guardrails.",
            steps: [
              {
                id: "s-2a",
                title: "2a. List Top 3 Failure Modes",
                detail: "Document where practitioners waste 90% of their time or introduce subtle bugs.",
                verificationOutcome: "A 3-item checklist of what NOT to do.",
                timeEstimate: "7 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Elite performers use first-principles thinking to invent new techniques rather than copying dogma.`,
        challengeQuestion: `What is the single most common false assumption made when learning ${topic}?`,
        challengeAnswer: `Assuming that more complexity equals higher competence. True mastery is radical simplicity.`,
        timeEstimate: "20 min",
        prerequisites: ["Curiosity"],
        xpReward: 120
      },
      {
        label: `Action Mission: The 20-Minute ${topic} Speed Drill`,
        description: `Tier ${depth + 1} Mission: Execute deliberate hands-on practice under timed conditions.`,
        branchKind: "action",
        icon: "⚡",
        whyItMatters: `Theoretical familiarity is fragile; physical execution under constraints builds muscle memory.`,
        keyInsight: `Speed drills expose bottlenecks in your workflow that passive reading hides.`,
        actionableSteps: [
          `Set a strict 20-minute timer in an empty workspace.`,
          `Build a minimal working demonstration from scratch.`,
          `Benchmark performance and log 1 improvement for tomorrow.`
        ],
        microTaskGroups: [
          {
            id: "tg-action-1",
            title: "Mission 1: Environment & Baseline Setup",
            overview: "Spin up a clean sandbox environment in under 4 minutes.",
            steps: [
              {
                id: "a-1a",
                title: "1a. Initialize Clean Sandbox",
                detail: "Open a fresh terminal or notebook and initialize dependencies.",
                commandSnippet: "mkdir drill-sandbox && cd drill-sandbox && npm init -y || python -m venv venv",
                verificationOutcome: "Working directory is clean with zero legacy baggage.",
                timeEstimate: "3 min",
                isDone: false,
              },
              {
                id: "a-1b",
                title: "1b. Scaffold the Minimal Core",
                detail: "Write only the irreducible minimum logic required to produce observable output.",
                verificationOutcome: "The script runs without exceptions in your terminal.",
                timeEstimate: "7 min",
                isDone: false,
              }
            ]
          },
          {
            id: "tg-action-2",
            title: "Mission 2: Stress-Test & Verification",
            overview: "Test extreme inputs and measure boundary behavior.",
            steps: [
              {
                id: "a-2a",
                title: "2a. Inject Edge Case Inputs",
                detail: "Test empty inputs, oversized payloads, or invalid types to confirm resilience.",
                commandSnippet: "test_runner.run([null, undefined, 1e9, 'invalid_payload'])",
                verificationOutcome: "System handles anomalies gracefully with clear error messages.",
                timeEstimate: "10 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Speed runs and timed katas used by competitive programmers and aerospace engineers.`,
        challengeQuestion: `Why is timed practice superior to unbounded open exploration for initial mastery?`,
        challengeAnswer: `Time constraints prevent premature optimization and force you to focus purely on essential critical paths.`,
        timeEstimate: "20 min",
        prerequisites: ["Mental Models"],
        xpReward: 250
      },
      {
        label: `Action Mission: Real-World Capstone Prototype`,
        description: `Tier ${depth + 1} Mission: Deliver a tangible, shareable artifact demonstrating ${topic}.`,
        branchKind: "action",
        icon: "🏆",
        whyItMatters: `A portfolio artifact proves competence to peers, hiring teams, and clients.`,
        keyInsight: `You do not truly understand something until you can ship it for public usage.`,
        actionableSteps: [
          `Scope a focused 1-feature deliverable.`,
          `Implement UI or CLI interface.`,
          `Deploy live to Vercel/GitHub.`
        ],
        microTaskGroups: [
          {
            id: "tg-cap-1",
            title: "Phase 1: Feature Scoping",
            overview: "Define the single killer interaction of this deliverable.",
            steps: [
              {
                id: "c-1a",
                title: "1a. Write 3 User Acceptance Criteria",
                detail: "Specify: 'Given X, When user does Y, Then system responds with Z'.",
                verificationOutcome: "Unambiguous definition of done.",
                timeEstimate: "5 min",
                isDone: false,
              }
            ]
          },
          {
            id: "tg-cap-2",
            title: "Phase 2: Build & Ship Live",
            overview: "Package and deploy the prototype to a public URL.",
            steps: [
              {
                id: "c-2a",
                title: "2a. Deploy to Vercel / GitHub",
                detail: "Run git push and verify the live production build.",
                commandSnippet: "git add . && git commit -m 'feat: ship capstone prototype' && git push",
                verificationOutcome: "Active public URL accessible from any device.",
                timeEstimate: "15 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Open-source authors building micro-libraries that solve 1 specific problem flawlessly.`,
        challengeQuestion: `What is the biggest risk during prototype development?`,
        challengeAnswer: `Scope creep — adding secondary features before the primary core value proposition is rock solid.`,
        timeEstimate: "35 min",
        prerequisites: ["Speed Drill"],
        xpReward: 300
      }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 2: ⚙️ ARCHITECTURE & SYSTEMS (Dataflow & Component Pipeline)
  // ═══════════════════════════════════════════════════════════════════════════
  if (mode === "arch") {
    return [
      {
        label: `Service Contract & Ingress Protocol`,
        description: `Architecture Layer: Gateway routing, payload serialization, and rate limiting.`,
        branchKind: "thought",
        icon: "🛡️",
        whyItMatters: `A strict API boundary protects internal microservices from malformed requests and DDoS spikes.`,
        keyInsight: `Treat every external boundary as hostile; validate at ingress and pass typed invariants internally.`,
        actionableSteps: [
          `Define OpenAPI/gRPC schema for incoming request payloads.`,
          `Configure JWT stateless authentication and scope verification.`,
          `Set up Token Bucket rate limiting per IP / API key.`
        ],
        microTaskGroups: [
          {
            id: "arch-tg-1",
            title: "Step 1: Schema Definition & Validation",
            overview: "Draft strict schema contracts using Zod or Protocol Buffers.",
            steps: [
              {
                id: "ar-1a",
                title: "1a. Write Request / Response Interface",
                detail: "Declare strict types for parameters, headers, and response payloads.",
                commandSnippet: "const RequestSchema = z.object({ id: z.string().uuid(), payload: z.record(z.unknown()) });",
                verificationOutcome: "Automated test rejects invalid payloads with 400 Bad Request.",
                timeEstimate: "10 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Stripe API gateway validating millions of webhook signatures per second.`,
        challengeQuestion: `Why is stateless token verification (JWT) preferred over database session lookups at high scale?`,
        challengeAnswer: `Because stateless verification requires only cryptographic CPU checks without hammering central database read IOPS.`,
        timeEstimate: "25 min",
        prerequisites: ["HTTP/REST", "Cryptography basics"],
        xpReward: 150
      },
      {
        label: `Action: Implement Asynchronous Event Pipeline`,
        description: `System Drill: Decouple synchronous API handlers with Redis / Kafka message queues.`,
        branchKind: "action",
        icon: "📨",
        whyItMatters: `Synchronous waiting causes cascading timeouts during upstream outages. Event queues buffer bursts.`,
        keyInsight: `Acknowledge HTTP 202 Accepted in under 20ms and push heavy computation to background worker pools.`,
        actionableSteps: [
          `Spin up Redis or RabbitMQ container in Docker.`,
          `Create an idempotent worker consumer group.`,
          `Implement Dead-Letter Queues (DLQ) with exponential backoff.`
        ],
        microTaskGroups: [
          {
            id: "arch-action-1",
            title: "Task 1: Queue Producer & Consumer Setup",
            overview: "Configure background workers to process jobs asynchronously.",
            steps: [
              {
                id: "aq-1a",
                title: "1a. Launch Local Broker",
                detail: "Run local message broker container.",
                commandSnippet: "docker run -d -p 6379:6379 --name arch-redis redis:alpine",
                verificationOutcome: "Redis responds to `redis-cli ping` with PONG.",
                timeEstimate: "5 min",
                isDone: false,
              },
              {
                id: "aq-1b",
                title: "1b. Write Idempotent Consumer",
                detail: "Ensure duplicate message deliveries do not trigger double billing or state corruption.",
                commandSnippet: "if (await redis.set(`processed:${msg.id}`, '1', 'NX', 'EX', 86400)) { await handle(msg); }",
                verificationOutcome: "Duplicate messages are safely ignored.",
                timeEstimate: "15 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Uber and Shopify processing millions of order events concurrently through Kafka topics.`,
        challengeQuestion: `What is the difference between at-least-once and exactly-once delivery semantics?`,
        challengeAnswer: `At-least-once ensures zero message loss but requires idempotent consumers; exactly-once adds heavy two-phase distributed coordination overhead.`,
        timeEstimate: "30 min",
        prerequisites: ["Docker", "Async Node.js"],
        xpReward: 250
      },
      {
        label: `Action: High-Throughput Caching & Invalidation`,
        description: `System Drill: Deploy Cache-Aside pattern with Redis and prevent Cache Stampedes.`,
        branchKind: "action",
        icon: "⚡",
        whyItMatters: `In-memory caching reduces 95% of database read load and cuts latency from 50ms to 2ms.`,
        keyInsight: `Set jittered TTLs to prevent all cached keys from expiring simultaneously during high traffic.`,
        actionableSteps: [
          `Implement Cache-Aside (Lazy Loading) query wrapper.`,
          `Add TTL jitter (+- 10% random offset) to prevent stampede.`,
          `Set up write-through invalidation on mutation endpoints.`
        ],
        microTaskGroups: [
          {
            id: "arch-cache-1",
            title: "Task 1: Build Cache-Aside Wrapper",
            overview: "Wrap database queries with Redis read-through layer.",
            steps: [
              {
                id: "ac-1a",
                title: "1a. Write getOrSet Helper",
                detail: "Check cache first, fallback to DB on miss, store with TTL.",
                commandSnippet: "const cached = await redis.get(key); if (cached) return JSON.parse(cached); const fresh = await db.fetch(); await redis.set(key, JSON.stringify(fresh), 'EX', 3600); return fresh;",
                verificationOutcome: "Subsequent queries return in <3ms from memory.",
                timeEstimate: "12 min",
                isDone: false,
              }
            ]
          }
        ],
        realWorldExample: `Twitter serving user timeline feeds instantly from Redis clusters.`,
        challengeQuestion: `How do you solve the Thundering Herd / Cache Stampede problem?`,
        challengeAnswer: `Use distributed mutex locking on cache miss so only 1 worker hits the DB while others wait for the cache refill.`,
        timeEstimate: "25 min",
        prerequisites: ["Redis", "SQL"],
        xpReward: 220
      }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE 3: 🔍 DETECTIVE BOARD (Investigative Case Files & Red Strings)
  // ═══════════════════════════════════════════════════════════════════════════
  return [
    {
      label: `Dossier: Core Case Evidence on ${topic}`,
      description: `Case File #1: Primary evidence, observed facts, and verified baseline data.`,
      branchKind: "thought",
      icon: "📜",
      whyItMatters: `An investigation built on assumptions collapses. Facts must be segregated from theories.`,
      keyInsight: `Follow the data trail: what can be mathematically or experimentally proven beyond a reasonable doubt?`,
      actionableSteps: [
        `Separate verified facts from subjective opinions.`,
        `Establish chronological timeline of key events.`,
        `Identify gaps in current testimony or dataset.`
      ],
      microTaskGroups: [
        {
          id: "det-tg-1",
          title: "Investigation 1: Fact Verification & Timeline",
          overview: "Cross-examine initial observations against primary sources.",
          steps: [
            {
              id: "d-1a",
              title: "1a. Audit Primary Source Artifacts",
              detail: "Inspect raw raw logs, research papers, or benchmark data directly.",
              verificationOutcome: "Documented list of 5 tamper-proof empirical facts.",
              timeEstimate: "10 min",
              isDone: false,
            }
          ]
        }
      ],
      realWorldExample: `Forensic data analysts finding root-cause security intrusions through immutable server audit logs.`,
      challengeQuestion: `What is confirmation bias in an investigation?`,
      challengeAnswer: `Selectively searching for evidence that confirms a pre-existing theory while ignoring contradictory data.`,
      timeEstimate: "20 min",
      prerequisites: ["Critical Thinking"],
      xpReward: 130
    },
    {
      label: `Action Mission: Forensic Hypothesis Experiment`,
      description: `Field Op: Design an experiment to prove or disprove the primary suspect hypothesis.`,
      branchKind: "action",
      icon: "🧪",
      whyItMatters: `Hypotheses are meaningless until subjected to falsification tests.`,
      keyInsight: `Try as hard as you can to break your own theory; whatever survives is close to the truth.`,
      actionableSteps: [
        `Formulate null hypothesis (H0) and testable claim (H1).`,
        `Run isolated control test.`,
        `Document statistical significance and findings.`
      ],
      microTaskGroups: [
        {
          id: "det-act-1",
          title: "Field Op 1: Controlled Experiment Run",
          overview: "Execute A/B control experiment under clean conditions.",
          steps: [
            {
              id: "da-1a",
              title: "1a. Set Control vs Variable",
              detail: "Hold all environment factors identical except for the 1 investigated variable.",
              commandSnippet: "run_benchmark({ controlGroup: baseConfig, testGroup: experimentalConfig, samples: 1000 })",
              verificationOutcome: "Reproducible dataset demonstrating causality.",
              timeEstimate: "15 min",
              isDone: false,
            }
          ]
        }
      ],
      realWorldExample: `A/B testing teams at Netflix proving algorithmic recommendation hypotheses on millions of subscribers.`,
      challengeQuestion: `Why is correlation not proof of causation in investigative analytics?`,
      challengeAnswer: `Two variables may correlate due to a hidden third confounding factor rather than direct cause-and-effect.`,
      timeEstimate: "30 min",
      prerequisites: ["Evidence Dossier"],
      xpReward: 240
    },
    {
      label: `Action Mission: The Final Case Synthesis & Verdict`,
      description: `Field Op: Connect the red strings across all clues and publish the comprehensive case solution.`,
      branchKind: "action",
      icon: "🕵️",
      whyItMatters: `Synthesizing fragmented clues into a cohesive mental architecture is the ultimate sign of mastery.`,
      keyInsight: `When all impossibilities are eliminated, whatever remains, however improbable, must be the truth.`,
      actionableSteps: [
        `Trace the link between all open clue nodes on the corkboard.`,
        `Synthesize the root cause explanation in a 1-page report.`,
        `Present verdict and recommended action plan.`
      ],
      microTaskGroups: [
        {
          id: "det-syn-1",
          title: "Field Op 2: Case Report Publication",
          overview: "Draft the comprehensive final findings dossier.",
          steps: [
            {
              id: "ds-1a",
              title: "1a. Draft Case Summary & Key Findings",
              detail: "Synthesize problem, root causes, evidence, and preventative recommendations.",
              verificationOutcome: "Complete 3-section Case Closure Report ready for distribution.",
              timeEstimate: "20 min",
              isDone: false,
            }
          ]
        }
      ],
      realWorldExample: `Root-cause analysis (RCA) post-mortems published by engineering teams after resolving major outages.`,
      challengeQuestion: `What makes an investigative post-mortem effective?`,
      challengeAnswer: `Blameless focus on systemic and structural vulnerabilities rather than individual human error.`,
      timeEstimate: "35 min",
      prerequisites: ["Forensic Experiment"],
      xpReward: 300
    }
  ];
}
