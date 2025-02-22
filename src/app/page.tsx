import AnalystTeam from '@/components/AnalystTeam'
import ChatInterface from '@/components/ChatInterface'
import SuggestionPrompts from '@/components/SuggestionPrompts'

const suggestionPrompts = [
  {
    title: "Company Analysis",
    prompt: "Analyze AAPL's competitive position in the smartphone market",
  },
  {
    title: "Market Research",
    prompt: "What's the outlook for AI semiconductor stocks like NVDA and AMD?",
  },
  {
    title: "Investment Strategy",
    prompt: "Compare value stocks like KO and PG vs. growth stocks like TSLA and AMZN",
  },
  {
    title: "Risk Assessment",
    prompt: "Evaluate the risks of investing in regional banks like JPM and BAC",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            WALL-E Street
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your AI-powered hedge fund analysis platform. Just chat about any stocks you're interested in!
          </p>
        </div>

        <div className="mb-12">
          <SuggestionPrompts prompts={suggestionPrompts} />
          <ChatInterface />
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-xl font-semibold text-gray-900">Your Research Team</h2>
          <AnalystTeam />
        </div>
      </div>
    </main>
  )
}
