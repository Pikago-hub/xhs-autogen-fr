import { type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
  BaseNodeFooter,
} from "../base-node-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { useState } from "react";
import { workflowService } from "@/lib/workflow-service";
import { type MediaSelectorNodeData } from "@/types/nodes";

export function MediaSelectorNode({ data }: NodeProps) {
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nodeData = data as MediaSelectorNodeData;
  const status: NodeStatus = nodeData.status || "initial";
  const isDisabled =
    status === "initial" ||
    status === "loading" ||
    status === "success" ||
    isSubmitting;

  const handleNextStep = async () => {
    if (!selectedMedia || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await workflowService.submitMediaSelection(
        selectedMedia as "image" | "video"
      );
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NodeStatusIndicator status={status}>
      <BaseNode showExtraHandles={true}>
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Media Selector</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <Select
            value={selectedMedia}
            onValueChange={setSelectedMedia}
            disabled={isDisabled}
          >
            <SelectTrigger className="text-xs h-8 w-40">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </BaseNodeContent>

        <BaseNodeFooter>
          <Button
            size="sm"
            className="w-full text-xs h-7"
            disabled={isDisabled || !selectedMedia}
            onClick={handleNextStep}
          >
            {isSubmitting ? "Submitting..." : "Next Step"}
          </Button>
        </BaseNodeFooter>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
