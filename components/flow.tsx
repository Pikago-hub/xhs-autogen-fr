"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type OnConnect,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { ZoomSlider } from "@/components/zoom-slider";
import { IdeaNode } from "@/components/nodes/idea-node";
import { MediaSelectorNode } from "@/components/nodes/media-selector-node";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import flowConfig from "@/config/flow-config.json";

const nodeTypes = {
  idea: IdeaNode,
  mediaSelector: MediaSelectorNode,
};

function FlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flowConfig.nodes as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flowConfig.edges as Edge[]
  );
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onConnect: OnConnect = (connection) =>
    setEdges((eds) => addEdge(connection, eds));

  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  return (
    <div className="w-screen h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <ZoomSlider />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="react-flow"
      >
        {mounted && (
          <>
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
              color={isDark ? "#333" : "#ccc"}
            />
          </>
        )}
      </ReactFlow>
    </div>
  );
}

export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowComponent />
    </ReactFlowProvider>
  );
}
