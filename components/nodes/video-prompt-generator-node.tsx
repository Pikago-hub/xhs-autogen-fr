import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node-components";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { Textarea } from "@/components/ui/textarea";
import { type VideoPromptGeneratorNodeData } from "@/types/nodes";

export function VideoPromptGeneratorNode({ data }: NodeProps) {
  const nodeData = data as VideoPromptGeneratorNodeData;
  const status: NodeStatus = nodeData.status || "initial";

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-[400px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Video Prompt Generator</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated video prompt:
            </div>
            <Textarea
              value={
                nodeData.content ||
                (status === "loading" ? "Generating video prompt..." : "")
              }
              readOnly
              className={`text-sm leading-relaxed min-h-[200px] max-h-[200px] resize-none bg-muted/50 border overflow-y-auto w-full ${
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
