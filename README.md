# WALL-E Street: AI Legends, Human Investments 🤖📈

Your AI investment dream team: Warren Buffett's value wisdom, Cathie Wood's innovation insight, and more, all guided by WALL-E. Talk stocks with AI versions of legendary investors.

## Inspiration 💡

Daniel and Bruno are fintech nerds with combined experience at Nubank, Robinhood, and Stripe. After years of drowning in spreadsheets and research reports, we realized something: the future of investment research isn't in more data—it's in smarter analysis.

We asked ourselves: "What if we could talk to Warren Buffett about our stock picks? What would Cathie Wood say about our tech investments?" That's when WALL-E Street was born.

## What it does 🚀

WALL-E Street is your personal AI investment committee:
- Get instant analysis from AI versions of legendary investors (Warren Buffett, Cathie Wood, Bill Ackman, Ben Graham)
- Each analyst applies their unique investment philosophy to your stocks
- WALL-E, your AI portfolio manager, synthesizes all insights into clear recommendations
- Have natural voice conversations about your investments using ElevenLabs
- Receive detailed breakdowns of fundamentals, growth potential, and risks
- Get actionable trading decisions with position sizing recommendations

## How we built it 🛠️

Tech Stack:
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python for the recommendation engine
- **AI/ML**: 
  - OpenAI GPT-4 for analysis and reasoning
  - ElevenLabs for natural voice conversations
  - LangChain for agent orchestration
- **Data**: Financial APIs for real-time market data
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel

## Challenges we ran into 🤔

1. Integrating Python-based recommendation engine with Next.js:
   - Solved by creating a clean API boundary and efficient data serialization
   - Optimized for real-time analysis without sacrificing performance

2. Making AI agents think like real investors:
   - Developed detailed prompts capturing each investor's philosophy
   - Fine-tuned responses for accuracy and authenticity

3. Managing complex state across multiple AI conversations:
   - Implemented robust state management for multi-agent interactions
   - Ensured consistent context across voice and text interfaces

## Accomplishments that we're proud of 🏆

1. Created an actually useful product we use ourselves
2. Built a beautiful, intuitive interface for complex financial analysis
3. Successfully replicated distinct investing styles of legendary investors
4. Achieved natural-feeling voice conversations about investments
5. Developed a scalable architecture for real-time financial analysis

## What we learned 📚

1. ElevenLabs voice AI creates an incredibly empowering user experience
2. The "investment committee" concept resonates strongly with users
3. AI can effectively combine different investment philosophies
4. Real-time financial analysis requires careful architecture decisions
5. Users love "talking" to their favorite investors

## What's next for WALL-E Street 🔮

1. Expanding the analyst roster with more legendary investors
2. Adding more asset classes beyond stocks
3. Implementing portfolio tracking and rebalancing
4. Developing mobile apps for iOS and Android
5. Building a community of AI-powered investors

## Try it out 🎯

[Demo Link Coming Soon]

## Team 👥

- Daniel - Ex-Robinhood, Stripe | Full-stack & AI
- Bruno - Ex-Nubank | Product & Engineering

---

Built with ❤️ for investors who want AI superpowers

## Setup & Development

### Prerequisites
- Node.js (v18 or higher)
- Python 3.12 or higher
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/WALL-E-Street.git
cd WALL-E-Street
```

2. Install dependencies and start development servers
```bash
npm install
npm run dev
```

The `npm run dev` command will:
1. Set up a Python virtual environment (if not exists)
2. Install Python dependencies
3. Start the Next.js frontend (http://localhost:3000)
4. Start the FastAPI backend (http://localhost:8000)

### Manual Setup (if needed)

If you need to set up the Python environment separately:
```bash
npm run setup  # Sets up Python venv and installs dependencies
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```
