import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "../base-node-components";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { type GeneratedVideoNodeData } from "@/types/nodes";

export function GeneratedVideoNode({ data }: NodeProps) {
  const nodeData = data as GeneratedVideoNodeData;
  const status: NodeStatus = nodeData.status || "initial";

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-[300px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Generated Video</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI-generated video:
            </div>
            <div className="min-h-[200px] bg-muted/50 border rounded-md flex items-center justify-center">
              {nodeData.content && nodeData.content.startsWith("http") ? (
                <video
                  src={nodeData.content}
                  controls
                  className="max-w-full max-h-[200px] object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-muted-foreground">
                  {status === "loading" ? "Generating video..." : ""}
                </div>
              )}
            </div>
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
