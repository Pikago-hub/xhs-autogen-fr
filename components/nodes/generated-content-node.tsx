import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
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
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Generated Content</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated content based on your idea:
            </div>
            <Textarea
              value={
                nodeData.content ||
                (status === "loading" ? "Generating content..." : "")
              }
              readOnly
              className={`text-base leading-relaxed min-h-[400px] max-h-[400px] resize-none bg-muted/50 border overflow-y-auto w-full ${
                status === "success" ? "pointer-events-auto" : ""
              }`}
            />
            {nodeData.agent && (
              <div className="text-sm text-muted-foreground">
                Agent: {nodeData.agent} •{" "}
                {nodeData.timestamp &&
                  new Date(nodeData.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
