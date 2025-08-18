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
import { Button } from "@/components/ui/button";
import { ZoomSlider } from "@/components/zoom-slider";
import { IdeaNode } from "@/components/nodes/idea-node";
import { GeneratedContentNode } from "@/components/nodes/generated-content-node";
import { MediaSelectorNode } from "@/components/nodes/media-selector-node";
import { ImagePromptGeneratorNode } from "@/components/nodes/image-prompt-generator-node";
import { VideoPromptGeneratorNode } from "@/components/nodes/video-prompt-generator-node";
import { GeneratedImageNode } from "@/components/nodes/generated-image-node";
import { GeneratedVideoNode } from "@/components/nodes/generated-video-node";
import { ContentReviewNode } from "@/components/nodes/content-review-node";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import flowConfig from "@/config/flow-config.json";
import { workflowService } from "@/lib/workflow-service";

const nodeTypes = {
  idea: IdeaNode,
  generatedContent: GeneratedContentNode,
  mediaSelector: MediaSelectorNode,
  imagePromptGenerator: ImagePromptGeneratorNode,
  videoPromptGenerator: VideoPromptGeneratorNode,
  generatedImage: GeneratedImageNode,
  generatedVideo: GeneratedVideoNode,
  contentReview: ContentReviewNode,
};

const NODE_IDS = {
  IDEA: "1",
  CONTENT: "2",
  MEDIA_SELECTOR: "3",
  IMAGE_PROMPT: "4",
  VIDEO_PROMPT: "5",
  IMAGE_DISPLAY: "6",
  VIDEO_DISPLAY: "7",
  REVIEW: "8",
} as const;

function FlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flowConfig.nodes as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flowConfig.edges as Edge[]
  );
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasWorkflowStarted, setHasWorkflowStarted] = useState(false);

  // helper function to update nodes
  const updateNodes = useCallback(
    (
      updates:
        | Array<{ nodeId: string; data: Record<string, unknown> }>
        | { nodeId: string; data: Record<string, unknown> }
    ) => {
      const updateArray = Array.isArray(updates) ? updates : [updates];

      setNodes((nds) =>
        nds.map((node) => {
          const update = updateArray.find((u) => u.nodeId === node.id);
          return update
            ? { ...node, data: { ...node.data, ...update.data } }
            : node;
        })
      );
    },
    [setNodes]
  );

  // Enable the idea node
  const handleRunFlow = () => {
    setIsRunning(true);
    updateNodes({
      nodeId: NODE_IDS.IDEA,
      data: {
        status: "ready",
        onConfirm: handleIdeaConfirm,
      },
    });
  };

  // Handle idea confirmation and start the workflow
  const handleIdeaConfirm = useCallback(
    async (idea: string) => {
      updateNodes([
        {
          nodeId: NODE_IDS.IDEA,
          data: { status: "success", confirmedIdea: idea },
        },
        {
          nodeId: NODE_IDS.CONTENT,
          data: { status: "loading" },
        },
      ]);

      try {
        await workflowService.startWorkflow({ content_idea: idea });
        setHasWorkflowStarted(true);

        workflowService.connectSSE((error) => {
          console.error("SSE connection error:", error);
          setIsRunning(false);
        });
      } catch (error) {
        console.error("Failed to start workflow:", error);
        updateNodes({ nodeId: NODE_IDS.IDEA, data: { status: "error" } });
      }
    },
    [updateNodes]
  );

  // Handle cancel workflow
  const handleCancelWorkflow = async () => {
    try {
      await workflowService.cancelWorkflow();
    } catch (error) {
      console.error("Failed to cancel workflow:", error);
    }

    setIsRunning(false);
    setHasWorkflowStarted(false);

    // reset all nodes to initial state
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: "initial",
          content: undefined,
          confirmedIdea: undefined,
          onConfirm: undefined,
          clearInput: Date.now(),
        },
      }))
    );
  };

  // handle edge connections
  const onConnect: OnConnect = (connection) =>
    setEdges((eds) => addEdge(connection, eds));

  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  return (
    <div className="w-screen h-screen bg-background">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          size="sm"
          className="text-xs"
          disabled={isRunning}
          onClick={handleRunFlow}
        >
          Run Flow
        </Button>
        {hasWorkflowStarted && (
          <Button
            size="sm"
            className="text-xs bg-white text-black hover:bg-white/90"
            onClick={handleCancelWorkflow}
          >
            Cancel Workflow
          </Button>
        )}
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
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          type: "smoothstep",
        }}
      >
        {mounted && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color={isDark ? "#333" : "#ccc"}
          />
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
