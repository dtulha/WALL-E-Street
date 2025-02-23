export interface HedgeFundResponse {
  content: string;
  chainOfThought?: string[];
}

export interface AnalystResponse {
  content: string;
  analyst: {
    name: string;
    avatar: string;
  };
  chainOfThought?: string[];
  signals?: {
    [ticker: string]: AnalystSignal;
  };
}

export interface PortfolioManagerResponse {
  content: string;
  portfolioManager: {
    name: string;
    avatar: string;
  };
  chainOfThought?: string[];
  decisions: {
    [ticker: string]: PortfolioDecision;
  };
}

export interface AnalystSignal {
  signal: string;
  reasoning: string;
  confidence?: number;
}

export interface PortfolioDecision {
  action: string;
  reasoning: string;
  quantity: number;
  confidence?: number;
}

export class ApiError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private static baseUrl: string = '/api';

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new ApiError('Health check failed', {
          status: response.status,
          statusText: response.statusText
        });
      }
      return true;
    } catch (error) {
      throw new ApiError('Health check failed', error);
    }
  }

  static async analyzeStocks({ tickers }: { tickers: string[] }): Promise<Record<string, AnalystResponse | PortfolioManagerResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError('Stock analysis failed', error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to analyze stocks', error);
    }
  }

  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message: string): Promise<AnalystResponse | PortfolioManagerResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError('API request failed', error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to send message', error);
    }
  }
} 