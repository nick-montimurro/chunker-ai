import {
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceLink,
  forceCenter,
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
  width?: number;
  height?: number;
  data: NodeData;
  isRoot?: boolean;
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

/**
 * Computes fluid, non-overlapping force-directed coordinates for React Flow nodes.
 * Keeps root near the center, pushes overlapping nodes apart with collision physics,
 * and maintains elastic edge lengths.
 */
export function applyFluidPhysicsLayout(
  nodes: Node<NodeData>[],
  edges: Edge[],
  iterations: number = 80
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

  // Force simulation setup
  const sim = forceSimulation<SimNode>(simNodes)
    .force(
      "charge",
      forceManyBody<SimNode>()
        .strength((d) => (d.isRoot ? -2500 : -1400))
        .distanceMax(900)
    )
    .force(
      "collide",
      forceCollide<SimNode>()
        .radius(160) // Node radius with generous clearance (node width ~220px, height ~160px)
        .iterations(4)
    )
    .force(
      "link",
      forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.id)
        .distance(300) // Optimal link distance
        .strength(0.7)
    )
    .stop();

  // Run simulation ticks synchronously for stable layout
  for (let i = 0; i < iterations; i++) {
    sim.tick();
    // Keep root pinned to anchor center
    const root = simNodes.find((n) => n.isRoot);
    if (root) {
      root.x = 520;
      root.y = 380;
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
 * Rather than stacking vertically or overlapping ancestors, branches fan outwards
 * along the direction vector from the root through the parent.
 */
export function calculateOutwardBranchPositions(
  parentId: string,
  parentPos: { x: number; y: number },
  count: number,
  rootPos: { x: number; y: number } = { x: 520, y: 380 }
): { x: number; y: number }[] {
  // Vector from root to parent
  const dx = parentPos.x - rootPos.x;
  const dy = parentPos.y - rootPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // If parent is at root, distribute evenly in all directions
  if (dist < 10) {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      return {
        x: parentPos.x + Math.cos(angle) * 320,
        y: parentPos.y + Math.sin(angle) * 320,
      };
    });
  }

  // Base outward angle from root through parent
  const baseAngle = Math.atan2(dy, dx);
  const branchDistance = 290;
  const spreadArc = Math.min(Math.PI * 0.75, (count - 1) * 0.45); // Spread angle range

  return Array.from({ length: count }).map((_, i) => {
    const offsetAngle = count === 1 ? 0 : -spreadArc / 2 + (i / (count - 1)) * spreadArc;
    const angle = baseAngle + offsetAngle;
    return {
      x: parentPos.x + Math.cos(angle) * branchDistance,
      y: parentPos.y + Math.sin(angle) * branchDistance,
    };
  });
}
