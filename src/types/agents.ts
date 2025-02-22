export type Agent = {
  id: string;
  name: string;
  description: string;
  endpoint: string;
};

export const agents: Agent[] = [
  {
    id: 'graham',
    name: 'Ben Graham',
    description: 'The godfather of value investing, only buys hidden gems with a margin of safety',
    endpoint: '/api/analyze/graham',
  },
  {
    id: 'buffett',
    name: 'Warren Buffett',
    description: 'The oracle of Omaha, seeks wonderful companies at a fair price',
    endpoint: '/api/analyze/buffett',
  },
  {
    id: 'ackman',
    name: 'Bill Ackman',
    description: 'An activist investor, takes bold positions and pushes for change',
    endpoint: '/api/analyze/ackman',
  },
  {
    id: 'fundamentals',
    name: 'Fundamentals Analyst',
    description: 'Analyzes fundamental data and generates trading signals',
    endpoint: '/api/analyze/fundamentals',
  },
  {
    id: 'technicals',
    name: 'Technical Analyst',
    description: 'Analyzes technical indicators and generates trading signals',
    endpoint: '/api/analyze/technicals',
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analyst',
    description: 'Analyzes market sentiment and generates trading signals',
    endpoint: '/api/analyze/sentiment',
  },
  {
    id: 'valuation',
    name: 'Valuation Analyst',
    description: 'Calculates the intrinsic value of a stock and generates trading signals',
    endpoint: '/api/analyze/valuation',
  },
]; 