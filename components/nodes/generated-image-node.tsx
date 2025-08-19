import { type NodeProps } from "@xyflow/react";
import Image from "next/image";
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
            <div className="min-h-[200px] bg-muted/50 border rounded-md flex items-center justify-center">
              {nodeData.content && nodeData.content.startsWith("http") ? (
                <Image
                  src={nodeData.content}
                  alt="Generated content"
                  width={300}
                  height={200}
                  className="max-w-full max-h-[200px] object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  {status === "loading" ? "Generating image..." : ""}
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
