import AnalystTeam from '@/components/AnalystTeam'
import ChatInterface from '@/components/ChatInterface'
import SuggestionPrompts from '@/components/SuggestionPrompts'

const suggestionPrompts = [
  {
    title: "Company Analysis",
    prompt: "Analyze Tesla's competitive position in the EV market",
  },
  {
    title: "Market Research",
    prompt: "What's the outlook for AI semiconductor stocks?",
  },
  {
    title: "Investment Strategy",
    prompt: "Compare value vs. growth investing in the current market",
  },
  {
    title: "Risk Assessment",
    prompt: "Evaluate the risks of investing in regional banks",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            WALL-E Street
          </h1>
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
