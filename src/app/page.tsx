import AnalystTeam from '@/components/AnalystTeam'
import ChatInterface from '@/components/ChatInterface'
import SuggestionPrompts from '@/components/SuggestionPrompts'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const suggestionPrompts = [
  {
    title: "NVIDIA Analysis",
    prompt: "What's your take on NVIDIA's AI chip dominance and market position?",
  },
  {
    title: "TSMC Deep Dive",
    prompt: "Analyze TSMC's competitive advantages in semiconductor manufacturing",
  },
  {
    title: "Apple Stock",
    prompt: "How will Apple's Vision Pro impact their stock performance?",
  },
  {
    title: "Tesla Review",
    prompt: "What are Tesla's growth prospects in the EV market for 2024?",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className={`${inter.className} mb-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl`}>
            WALL-E Street
          </h1>
          <p className={`${inter.className} text-lg font-medium text-gray-600`}>
            Your AI Investment Crew: Warren, Cathie, and Other Wall Street Legends at Your Command
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
