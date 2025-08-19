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
import { useEffect, useState, useCallback } from "react";
import flowConfig from "@/config/flow-config.json";
import { workflowService } from "@/lib/workflow-service";
import type { SSEEvent } from "@/types/workflow";

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

// Mapping agent names to Nodes
const AGENT_NODE_MAPPING: Record<string, string> = {
  content_creator: NODE_IDS.CONTENT,
  media_selector: NODE_IDS.MEDIA_SELECTOR,
  gpt_image_prompt_engineer: NODE_IDS.IMAGE_PROMPT,
  seedance_prompt_engineer: NODE_IDS.VIDEO_PROMPT,
  gpt_image_agent: NODE_IDS.IMAGE_DISPLAY,
  seedance_api_agent: NODE_IDS.VIDEO_DISPLAY,
  content_reviewer: NODE_IDS.REVIEW,
  rednote_publisher: NODE_IDS.REVIEW,
};

const MEDIA_URL_AGENTS = new Set(["gpt_image_agent", "seedance_api_agent"]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [processedEvents, setProcessedEvents] = useState(new Set<string>());

  // Helper function to update nodes - can handle single or multiple updates
  const updateNodes = useCallback(
    (
      updates:
        | Array<{ nodeId: string; data: Record<string, unknown> }>
        | { nodeId: string; data: Record<string, unknown> }
    ) => {
      // Convert single update to array for consistent handling
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

  // Process content from agents - now just pass through since backend sends clean data
  const processAgentContent = useCallback(
    (agent: string, content: string): string => {
      // For media agents, prepend API base URL to the file path
      if (MEDIA_URL_AGENTS.has(agent)) {
        return `${API_BASE_URL}${content}`;
      }

      return content;
    },
    []
  );

  useEffect(() => {
    setMounted(true);

    // Set up media selection success callback
    workflowService.setMediaSelectionSuccessCallback(
      (mediaType: "image" | "video") => {
        const updates: Array<{
          nodeId: string;
          data: Record<string, unknown>;
        }> = [
          {
            nodeId: NODE_IDS.MEDIA_SELECTOR,
            data: { status: "success", selectedMedia: mediaType },
          },
        ];

        // Set the appropriate prompt generator to loading
        if (mediaType === "image") {
          updates.push({
            nodeId: NODE_IDS.IMAGE_PROMPT,
            data: { status: "loading" },
          });
        } else {
          updates.push({
            nodeId: NODE_IDS.VIDEO_PROMPT,
            data: { status: "loading" },
          });
        }

        updateNodes(updates);
      }
    );

    // Set up content review success callback
    workflowService.setContentReviewSuccessCallback(
      (action: "post" | "regenerate") => {
        setNodes((nds) => {
          // Find selected media type from media selector node
          const mediaSelectorNode = nds.find(
            (n) => n.id === NODE_IDS.MEDIA_SELECTOR
          );
          const selectedMedia = mediaSelectorNode?.data?.selectedMedia;

          const updates: Array<{
            nodeId: string;
            data: Record<string, unknown>;
          }> = [{ nodeId: NODE_IDS.REVIEW, data: { status: "loading" } }];

          // For regenerate, reset the appropriate media display node
          if (action === "regenerate" && selectedMedia) {
            const displayNodeId =
              selectedMedia === "image"
                ? NODE_IDS.IMAGE_DISPLAY
                : NODE_IDS.VIDEO_DISPLAY;
            updates.push({
              nodeId: displayNodeId,
              data: { status: "loading", content: undefined },
            });
          }

          return nds.map((node) => {
            const update = updates.find((u) => u.nodeId === node.id);
            return update
              ? { ...node, data: { ...node.data, ...update.data } }
              : node;
          });
        });
      }
    );
  }, [setNodes, updateNodes]);

  // SSE event handler
  const handleSSEEvent = useCallback(
    (event: SSEEvent) => {
      if (event.event === "agent_message") {
        const { agent, content } = event.data;

        // Get the node ID for this agent
        const nodeId = AGENT_NODE_MAPPING[agent];
        if (!nodeId) {
          // System messages or unknown agents
          return;
        }

        // Process the content
        const processedContent = processAgentContent(agent, content);

        // Special handling for content_reviewer - keep loading state when POST_APPROVED
        if (agent === "content_reviewer" && content.includes("POST_APPROVED")) {
          updateNodes({
            nodeId: nodeId,
            data: {
              status: "loading", // Keep loading while publishing
              agent: agent,
              content: processedContent,
              timestamp: event.data.timestamp,
            },
          });
        } else if (agent === "rednote_publisher") {
          // Check if publishing was successful
          const isSuccess =
            content.includes("Successfully posted to RedNote") ||
            content.includes("successfully posted to RedNote") ||
            content.includes(
              "Content has been successfully posted to RedNote"
            ) ||
            content.includes("WORKFLOW COMPLETE");

          updateNodes({
            nodeId: nodeId,
            data: {
              status: isSuccess ? "success" : "error",
              agent: agent,
              content: processedContent,
              timestamp: event.data.timestamp,
            },
          });
        } else {
          // Update the primary node with success status for all other cases
          updateNodes({
            nodeId: nodeId,
            data: {
              status: "success",
              agent: agent,
              content: processedContent,
              timestamp: event.data.timestamp,
            },
          });
        }

        // Handle side effects for specific agents
        if (agent === "gpt_image_prompt_engineer") {
          updateNodes({
            nodeId: NODE_IDS.IMAGE_DISPLAY,
            data: { status: "loading" },
          });
        } else if (agent === "seedance_prompt_engineer") {
          updateNodes({
            nodeId: NODE_IDS.VIDEO_DISPLAY,
            data: { status: "loading" },
          });
        }
      }

      // Handle media selection required event
      if (event.event === "media_selection_required") {
        const eventKey = `${event.event}_${event.data.workflow_id}`;
        if (!processedEvents.has(eventKey)) {
          setProcessedEvents((prev) => new Set(prev).add(eventKey));
          updateNodes({
            nodeId: NODE_IDS.MEDIA_SELECTOR,
            data: { status: "ready" },
          });
        }
      }

      // Handle content review required event
      if (event.event === "content_review_required") {
        const eventKey = `${event.event}_${event.data.workflow_id}`;
        if (!processedEvents.has(eventKey)) {
          setProcessedEvents((prev) => new Set(prev).add(eventKey));
          updateNodes({ nodeId: NODE_IDS.REVIEW, data: { status: "ready" } });
        }
      }

      // Handle workflow completion
      if (event.event === "workflow_complete") {
        setIsRunning(false);
        setHasWorkflowStarted(false);
        workflowService.disconnectSSE();

        // For workflow completion, we should let agent messages handle the status updates
        // Only set to success if the review node is still in "ready" state (meaning no action was taken)
        setNodes((nds) =>
          nds.map((node) =>
            node.id === NODE_IDS.REVIEW && node.data?.status === "ready"
              ? { ...node, data: { ...node.data, status: "success" } }
              : node
          )
        );
      }
    },
    [
      processedEvents,
      setIsRunning,
      setHasWorkflowStarted,
      updateNodes,
      setNodes,
      processAgentContent,
    ]
  );

  // Handle idea confirmation
  const handleIdeaConfirm = useCallback(
    async (idea: string) => {
      // Update both idea and content nodes
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

        // Connect to SSE for real-time updates
        workflowService.connectSSE(handleSSEEvent, (error) => {
          console.error("SSE connection error:", error);
          setIsRunning(false);
        });
      } catch (error) {
        console.error("Failed to start workflow:", error);
        updateNodes({ nodeId: NODE_IDS.IDEA, data: { status: "error" } });
      }
    },
    [handleSSEEvent, updateNodes]
  );

  // Handle cancel workflow
  const handleCancelWorkflow = async () => {
    try {
      await workflowService.cancelWorkflow();
    } catch (error) {
      console.error("Failed to cancel workflow:", error);
    }

    // Reset state
    setIsRunning(false);
    setHasWorkflowStarted(false);
    setProcessedEvents(new Set());

    // Reset all nodes to initial state
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: "initial",
          content: undefined,
          confirmedIdea: undefined,
          onConfirm: undefined,
          clearInput: Date.now(), // Force input clear
        },
      }))
    );
  };

  // Start workflow - prepares UI for idea input
  const handleRunFlow = () => {
    setIsRunning(true);
    updateNodes({
      nodeId: NODE_IDS.IDEA,
      data: {
        onConfirm: handleIdeaConfirm,
        status: "ready",
      },
    });
  };

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      workflowService.disconnectSSE();
    };
  }, []);

  // Handle edge connections
  const onConnect: OnConnect = (connection) =>
    setEdges((eds) => addEdge(connection, eds));

  // Determine dark mode
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
          onClick={handleRunFlow}
          disabled={isRunning}
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
