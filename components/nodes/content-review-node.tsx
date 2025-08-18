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
import { type ContentReviewNodeData } from "@/types/nodes";

export function ContentReviewNode({ data }: NodeProps) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const nodeData = data as ContentReviewNodeData;
  const status: NodeStatus = nodeData.status || "initial";
  const isDisabled =
    status === "initial" || status === "loading" || status === "success";

  return (
    <NodeStatusIndicator status={status}>
      <BaseNode className="w-[280px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Content Review</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Please review the generated content and choose an action:
            </div>
            <Select
              value={selectedAction}
              onValueChange={setSelectedAction}
              disabled={isDisabled}
            >
              <SelectTrigger className="text-xs h-8 w-full">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Post Content</SelectItem>
                <SelectItem value="regenerate">Regenerate Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </BaseNodeContent>

        <BaseNodeFooter>
          <Button
            size="sm"
            className="w-full text-xs h-7"
            disabled={isDisabled || !selectedAction}
          >
            Submit Review
          </Button>
        </BaseNodeFooter>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
