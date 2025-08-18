export interface WorkflowData {
    content_idea?: string;
  }
  
export interface WorkflowResponse {
    workflow_id: string;
    status: string;
    message?: string;
  }
  
export interface SSEEvent {
    event: string;
    data: {
        agent: string;
        content: string;
        timestamp: string;
        workflow_id?: string;
        stage?: string;
        status?: string;
        current_stage?: string;
        [key: string]: unknown;
    }
}

export interface ApiResponse {
    status: string;
    message?: string;
    data?: unknown;
}
  
export type MediaType = "image" | "video";
export type ReviewAction = "post" | "regenerate";