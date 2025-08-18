import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeContent,
} from "../base-node-components";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { Textarea } from "@/components/ui/textarea";
import { type GeneratedContentNodeData } from "@/types/nodes";

export function GeneratedContentNode({ data }: NodeProps) {
  const nodeData = data as GeneratedContentNodeData;
  const status: NodeStatus = nodeData.status || "initial";

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-[500px]">
        <BaseNodeHeader>Generated Content</BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated content based on your idea:
            </div>
            <Textarea
              placeholder="Enter your generated content here"
              className="h-[200px] resize-none"
            />
          </div>
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
