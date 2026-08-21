import type { NodeTypes } from "@xyflow/react";
import SkillNode from "@/components/nodes/SkillNode";
import ArchNode from "@/components/nodes/ArchNode";
import DetectiveNode from "@/components/nodes/DetectiveNode";

export const nodeTypes: NodeTypes = {
  skill: SkillNode,
  arch: ArchNode,
  detective: DetectiveNode,
};
