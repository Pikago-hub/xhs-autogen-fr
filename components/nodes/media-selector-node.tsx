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
import { useState } from "react";
import { NodeStatusIndicator, type NodeStatus } from "../node-status-indicator";
import { type MediaSelectorNodeData } from "@/types/nodes";

export function MediaSelectorNode({ data }: NodeProps) {
  const nodeData = data as MediaSelectorNodeData;
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const status: NodeStatus = nodeData.status || "initial";
  const isDisabled =
    status === "initial" || status === "loading" || status === "success";

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
          >
            Submit
          </Button>
        </BaseNodeFooter>
      </BaseNode>
    </NodeStatusIndicator>
  );
}
