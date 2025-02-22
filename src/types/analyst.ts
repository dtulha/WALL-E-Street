
export interface Analyst {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  reasoning: string[];
}

export interface AnalysisState {
  isAnalyzing: boolean;
  currentAnalyst: string | null;
  report: string | null;
  reasoningChains: {
    [key: string]: string[];
  };
}
