import type { 
  WorkflowData, 
  WorkflowResponse,  
  ApiResponse,
} from '@/types/workflow';

// intialize backend url from env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class WorkflowService {
  private eventSource: EventSource | null = null;
  private workflowId: string | null = null;


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

  connectSSE(onError?: (error: Event) => void): void {
    if (!this.workflowId) {
      return;
    }
    // make sure no existing connection
    this.disconnectSSE();

    try {
      this.eventSource = new EventSource(`${API_BASE_URL}/api/workflows/${this.workflowId}/stream`);

      this.eventSource.onerror = (error) => {
        if (onError) {
          onError(error);
        }
      };
    } catch (error) {
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
}

export const workflowService = new WorkflowService();