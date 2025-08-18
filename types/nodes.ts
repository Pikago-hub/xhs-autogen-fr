import { type NodeStatus } from "@/components/node-status-indicator";

export interface BaseNodeData {
  status?: NodeStatus;
}

export interface NodeDataWithContent extends BaseNodeData {
  content?: string;
  agent?: string;
  timestamp?: string;
}

export interface IdeaNodeData extends BaseNodeData {
  onConfirm?: (idea: string) => void;
  confirmedIdea?: string;
  clearInput?: number;
}

export interface GeneratedContentNodeData extends NodeDataWithContent {}

export interface MediaSelectorNodeData extends BaseNodeData {
  selectedMedia?: "image" | "video";
}

export interface ImagePromptGeneratorNodeData extends NodeDataWithContent {}

export interface VideoPromptGeneratorNodeData extends NodeDataWithContent {}

export interface GeneratedImageNodeData extends NodeDataWithContent {}

export interface GeneratedVideoNodeData extends NodeDataWithContent {}

export interface ContentReviewNodeData extends NodeDataWithContent {}

export type AnyNodeData = 
  | IdeaNodeData
  | GeneratedContentNodeData  
  | MediaSelectorNodeData
  | ImagePromptGeneratorNodeData
  | VideoPromptGeneratorNodeData
  | GeneratedImageNodeData
  | GeneratedVideoNodeData
  | ContentReviewNodeData;