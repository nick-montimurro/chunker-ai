import {
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceLink,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { type Node, type Edge } from "@xyflow/react";
import { type NodeData } from "@/store/useStore";

export interface SimNode extends SimulationNodeDatum {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  data: NodeData;
  isRoot?: boolean;
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

// Center anchor coordinate for root origin node
export const ROOT_CENTER = { x: 600, y: 450 };

/**
 * Computes fluid, non-overlapping force-directed coordinates for React Flow nodes.
 * Enforces generous clearance between all node cards and maintains clean organic spacing.
 */
export function applyFluidPhysicsLayout(
  nodes: Node<NodeData>[],
  edges: Edge[],
  iterations: number = 100
): Node<NodeData>[] {
  if (nodes.length <= 1) return nodes;

  const simNodes: SimNode[] = nodes.map((n) => ({
    id: n.id,
    x: n.position.x,
    y: n.position.y,
    data: n.data,
    isRoot: n.id === "root" || n.data.type === "root",
  }));

  const simLinks: SimLink[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }));

  // Force simulation setup with robust collision buffers
  const sim = forceSimulation<SimNode>(simNodes)
    .force(
      "charge",
      forceManyBody<SimNode>()
        .strength((d) => (d.isRoot ? -4500 : -2200))
        .distanceMin(180)
        .distanceMax(1400)
    )
    .force(
      "collide",
      forceCollide<SimNode>()
        .radius(210) // Generous 210px radius ensures 0% card overlap (cards are ~220x150)
        .iterations(6)
    )
    .force(
      "link",
      forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.id)
        .distance((l) => {
          const sourceIsRoot = typeof l.source === "object" ? l.source.isRoot : l.source === "root";
          return sourceIsRoot ? 400 : 340; // Ample link distance between levels
        })
        .strength(0.65)
    )
    .stop();

  // Run simulation ticks synchronously for stable organic equilibrium
  for (let i = 0; i < iterations; i++) {
    sim.tick();
    // Keep root pinned to anchor center
    const root = simNodes.find((n) => n.isRoot);
    if (root) {
      root.x = ROOT_CENTER.x;
      root.y = ROOT_CENTER.y;
    }
  }

  return nodes.map((node) => {
    const simNode = simNodes.find((sn) => sn.id === node.id);
    if (!simNode) return node;
    return {
      ...node,
      position: {
        x: Math.round(simNode.x),
        y: Math.round(simNode.y),
      },
    };
  });
}

/**
 * Calculates outward radiating positions for new child branches.
 * Radiates outwards in a wide fan arc in the direction vector away from the root origin.
 */
export function calculateOutwardBranchPositions(
  parentId: string,
  parentPos: { x: number; y: number },
  count: number,
  rootPos: { x: number; y: number } = ROOT_CENTER
): { x: number; y: number }[] {
  const dx = parentPos.x - rootPos.x;
  const dy = parentPos.y - rootPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // If parent is the root origin, distribute in a wide circular orbit
  if (dist < 20) {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      return {
        x: rootPos.x + Math.cos(angle) * 420,
        y: rootPos.y + Math.sin(angle) * 420,
      };
    });
  }

  // Base outward radiating angle from root through the parent node
  const baseAngle = Math.atan2(dy, dx);
  const branchDistance = 360; // Generous distance past parent
  const spreadArc = Math.min(Math.PI * 0.7, (count - 1) * 0.48); // Wide fan spread

  return Array.from({ length: count }).map((_, i) => {
    const offsetAngle = count === 1 ? 0 : -spreadArc / 2 + (i / (count - 1)) * spreadArc;
    const angle = baseAngle + offsetAngle;
    return {
      x: parentPos.x + Math.cos(angle) * branchDistance,
      y: parentPos.y + Math.sin(angle) * branchDistance,
    };
  });
}
