import { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";

interface BaseNodeProps {
  children: ReactNode;
  showHandles?: boolean;
  showExtraHandles?: boolean;
  className?: string;
}

export function BaseNode({
  children,
  showHandles = true,
  showExtraHandles = false,
  className = "",
}: BaseNodeProps) {
  return (
    <div
      className={`nodrag bg-card border-2 border-border rounded-lg min-w-[200px] shadow-sm ${className}`}
    >
      {showHandles && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!bg-primary !border-primary"
        />
      )}
      {showExtraHandles && (
        <>
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="!bg-primary !border-primary"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="!bg-primary !border-primary"
          />
        </>
      )}
      {children}
      {showHandles && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!bg-primary !border-primary"
        />
      )}
    </div>
  );
}

interface BaseNodeHeaderProps {
  children: ReactNode;
}

export function BaseNodeHeader({ children }: BaseNodeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border">
      {children}
    </div>
  );
}

interface BaseNodeHeaderTitleProps {
  children: ReactNode;
}

export function BaseNodeHeaderTitle({ children }: BaseNodeHeaderTitleProps) {
  return (
    <h3 className="font-semibold text-base text-card-foreground">{children}</h3>
  );
}

interface BaseNodeContentProps {
  children: ReactNode;
}

export function BaseNodeContent({ children }: BaseNodeContentProps) {
  return <div className="px-3 py-2">{children}</div>;
}

interface BaseNodeFooterProps {
  children: ReactNode;
}

export function BaseNodeFooter({ children }: BaseNodeFooterProps) {
  return (
    <div className="px-3 py-2 border-t border-border bg-muted/30">
      {children}
    </div>
  );
}
