import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node-components";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { Textarea } from "@/components/ui/textarea";
import { type ImagePromptGeneratorNodeData } from "@/types/nodes";

export function ImagePromptGeneratorNode({ data }: NodeProps) {
  const nodeData = data as ImagePromptGeneratorNodeData;
  const status: NodeStatus = nodeData.status || "initial";

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-[400px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Image Prompt Generator</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated image prompt:
            </div>
            <Textarea
              value={
                nodeData.content ||
                (status === "loading" ? "Generating image prompt..." : "")
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
