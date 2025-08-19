import type { 
  WorkflowData, 
  WorkflowResponse, 
  SSEEvent, 
  MediaType, 
  ReviewAction,
  ApiResponse
} from '@/types/workflow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class WorkflowService {
  private eventSource: EventSource | null = null;
  private workflowId: string | null = null;
  private onMediaSelectionSuccess: ((mediaType: MediaType) => void) | null = null;
  private onContentReviewSuccess: ((action: ReviewAction) => void) | null = null;

  async submitContentReview(action: ReviewAction): Promise<ApiResponse> {
    if (!this.workflowId) {
      throw new Error('No workflow ID available. Start workflow first.');
    }

    const payload = { action };

    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/${this.workflowId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      // Emit success event
      if (this.onContentReviewSuccess) {
        this.onContentReviewSuccess(action);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async submitMediaSelection(choice: MediaType): Promise<ApiResponse> {
    if (!this.workflowId) {
      throw new Error('No workflow ID available. Start workflow first.');
    }

    const payload = { choice };

    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/${this.workflowId}/media-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      // Emit success event
      if (this.onMediaSelectionSuccess) {
        this.onMediaSelectionSuccess(choice);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async cancelWorkflow(): Promise<ApiResponse> {
    if (!this.workflowId) {
      throw new Error('No workflow ID available to cancel.');
    }


    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/${this.workflowId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      // Clean up after cancellation
      this.disconnectSSE();
      this.workflowId = null;
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async startWorkflow(data: WorkflowData = {}): Promise<WorkflowResponse> {
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result: WorkflowResponse = await response.json();
      this.workflowId = result.workflow_id;
      return result;
    } catch (error) {
      throw error;
    }
  }

  connectSSE(onMessage: (event: SSEEvent) => void, onError?: (error: Event) => void): void {
    if (!this.workflowId) {
      return;
    }

    // make sure no existing connection
    this.disconnectSSE();

    try {
      this.eventSource = new EventSource(`${API_BASE_URL}/api/workflows/${this.workflowId}/stream`);

      this.eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          onMessage(data);
        } catch {
        }
      };

      this.eventSource.onerror = (error) => {
        if (onError) {
          onError(error);
        }
      };

    } catch {
    }
  }

  disconnectSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getWorkflowId(): string | null {
    return this.workflowId;
  }

  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }

  setMediaSelectionSuccessCallback(callback: (mediaType: MediaType) => void): void {
    this.onMediaSelectionSuccess = callback;
  }

  setContentReviewSuccessCallback(callback: (action: ReviewAction) => void): void {
    this.onContentReviewSuccess = callback;
  }

}
export const workflowService = new WorkflowService();