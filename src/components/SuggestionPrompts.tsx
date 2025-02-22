'use client'

interface SuggestionPrompt {
  title: string
  prompt: string
}

interface Props {
  prompts: SuggestionPrompt[]
}

export default function SuggestionPrompts({ prompts }: Props) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
      {prompts.map((item) => (
        <button
          key={item.title}
          onClick={() => window.dispatchEvent(new CustomEvent('useSuggestion', { detail: item.prompt }))}
          className="group rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-primary hover:shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
          <p className="text-xs text-gray-600 group-hover:text-primary">{item.prompt}</p>
        </button>
      ))}
    </div>
  )
} 