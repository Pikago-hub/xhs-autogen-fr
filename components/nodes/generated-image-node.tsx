import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node-components";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { type GeneratedImageNodeData } from "@/types/nodes";

export function GeneratedImageNode({ data }: NodeProps) {
  const nodeData = data as GeneratedImageNodeData;
  const status: NodeStatus = nodeData.status || "initial";

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-[300px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Generated Image</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated image:
            </div>
            <div className="min-h-[200px] bg-muted/50 border rounded-md flex items-center justify-center"></div>
          </div>
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
