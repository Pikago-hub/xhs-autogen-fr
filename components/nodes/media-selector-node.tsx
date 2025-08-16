import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
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

export function MediaSelectorNode({ data }: NodeProps) {
  const [selectedMedia, setSelectedMedia] = useState<string>("");

  return (
    <div className="nodrag bg-card border-2 border-border rounded-lg min-w-[200px] shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-primary"
      />

      <BaseNodeHeader>
        <BaseNodeHeaderTitle>Media Selector</BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        <Select value={selectedMedia} onValueChange={setSelectedMedia}>
          <SelectTrigger className="text-xs h-8">
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </BaseNodeContent>

      <BaseNodeFooter>
        <div className="flex gap-1">
          <Button size="sm" className="flex-1 text-xs h-7">
            Generate Image
          </Button>
          <Button size="sm" className="flex-1 text-xs h-7">
            Generate Video
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
            Cancel Workflow
          </Button>
        </div>
      </BaseNodeFooter>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-primary"
      />
    </div>
  );
}
