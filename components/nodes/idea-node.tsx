import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
  BaseNodeFooter,
} from "../base-node-components";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { useState, useEffect } from "react";
import { type IdeaNodeData } from "@/types/nodes";

export function IdeaNode({ data }: NodeProps) {
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nodeData = data as IdeaNodeData;

  // Clear input when cancel workflow is triggered
  useEffect(() => {
    if (nodeData.clearInput) {
      setIdea("");
    }
  }, [nodeData.clearInput]);

  const status: NodeStatus = nodeData.status || "initial";
  const isActivated = status === "ready" && nodeData.onConfirm;
  const canInput = isActivated && !isSubmitting;
  const isDisabled = !isActivated || isSubmitting;

  const handleConfirm = async () => {
    if (!idea.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Trigger callback passed from parent if available
      if (nodeData.onConfirm) {
        await nodeData.onConfirm(idea);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NodeStatusIndicator status={status}>
      <BaseNode className="w-[300px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Idea</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <p className="text-xs text-muted-foreground">
            What&apos;s your brilliant idea?
          </p>
        </BaseNodeContent>

        <BaseNodeFooter>
          <div className="space-y-2">
            <Textarea
              placeholder="Type your idea here..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="text-sm min-h-[80px] max-h-[120px] px-4 py-3 resize-none w-full"
              disabled={isDisabled}
              rows={3}
            />
            <Button
              size="sm"
              className="w-full text-xs h-7"
              onClick={handleConfirm}
              disabled={!idea.trim() || !canInput}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </div>
        </BaseNodeFooter>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
