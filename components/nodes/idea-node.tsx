import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
  BaseNodeFooter,
} from "../base-node-components";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function IdeaNode({ data }: NodeProps) {
  const [idea, setIdea] = useState("");

  return (
    <div className="nodrag bg-card border-2 border-border rounded-lg min-w-[200px] shadow-sm">
      <BaseNodeHeader>
        <BaseNodeHeaderTitle>Idea</BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeContent>
        <p className="text-xs text-muted-foreground">
          What's your brilliant idea?
        </p>
      </BaseNodeContent>

      <BaseNodeFooter>
        <Input
          placeholder="Type your idea here..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="text-xs h-8"
        />
      </BaseNodeFooter>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-primary"
      />
    </div>
  );
}
