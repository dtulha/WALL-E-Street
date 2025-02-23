'use client'

import { useEffect, useState } from 'react'
import { useConversation } from '@11labs/react'
import Image from 'next/image'

interface Message {
  text: string
  type: string
}

interface ConversationError {
  message: string
  code?: string
}

interface TranscriptEvent {
  text: string
  type: 'partial' | 'final'
}

interface ResearchContext {
  query: string
  responses: Array<{
    analyst: {
      name: string
      avatar: string
    }
    content: string
    chainOfThought?: string[]
  }>
  timestamp: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  researchContext: ResearchContext | null
}

export default function ElevenLabsConversation({ isOpen, onClose, researchContext }: Props) {
  const [agentContext, setAgentContext] = useState('')
  const [transcript, setTranscript] = useState<Array<{ text: string; isBot: boolean }>>([])
  const [currentSpeech, setCurrentSpeech] = useState('')
  
  const conversation = useConversation({
    agentId: "a8TvWe400bP8qryRRrzX",
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
    onMessage: (message: Message) => {
      console.log('Message received:', message)
      setTranscript(prev => [...prev, { text: message.text, isBot: true }])
    },
    onError: (error: ConversationError) => {
      console.error('Conversation error:', error)
      setTranscript(prev => [...prev, { text: 'Sorry, there was an error in our conversation.', isBot: true }])
    },
    onSpeechStart: () => {
      console.log('Speech started')
      setCurrentSpeech('')
    },
    onTranscript: (event: TranscriptEvent) => {
      console.log('Transcript event:', event)
      if (event.type === 'partial') {
        setCurrentSpeech(event.text)
      } else if (event.type === 'final') {
        setCurrentSpeech('')
        setTranscript(prev => [...prev, { text: event.text, isBot: true }])
      }
    }
  })

  useEffect(() => {
    if (researchContext && isOpen) {
      const context = `You are WALL-E, an AI research assistant and portfolio manager, extremely knowledgeable in everything in the world of finance and stocks. You want to help your customers make the best financial decisions. You are going to engage in a conversation knowing the context of the research that you have done with your team of specialists. The context is: {{ResearchContext}}`

      const variables = {
        ResearchContext: `
          Research Query: ${researchContext.query}
          Generated on: ${researchContext.timestamp}

          Analyst Responses:
          ${researchContext.responses.map(response => `
            ${response.analyst.name}:
            ${response.content}
            ${response.chainOfThought ? `
            Key Points:
            ${response.chainOfThought.join('\n')}
            ` : ''}
          `).join('\n')}
        `.trim()
      }

      console.log('Starting session with context:', { context, variables })
      
      setAgentContext(context)
      // Start conversation with dynamic variable
      conversation.startSession({ 
        context,
        dynamicVariables: {
          ResearchContext: variables.ResearchContext
        }
      }).catch(error => {
        console.error('Failed to start session:', error)
        setTranscript(prev => [...prev, { 
          text: 'Failed to start the conversation. Please try again.', 
          isBot: true 
        }])
      })
    }
    
    return () => {
      conversation.endSession()
      setTranscript([])
      setCurrentSpeech('')
    }
  }, [researchContext, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">Discuss with Research Team</h2>
        
        <div className="h-[60vh] flex flex-col items-center">
          <div className="w-40 h-40 relative mb-4">
            <Image
              src="/avatars/wall-e.jpeg"
              alt="WALL-E"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>
          
          <div className="flex-1 w-full overflow-y-auto bg-gray-50 rounded-lg p-4">
            {transcript.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.isBot ? 'pl-4 border-l-4 border-blue-500' : ''}`}
              >
                <p className="text-gray-700">{message.text}</p>
              </div>
            ))}
            {currentSpeech && (
              <div className="pl-4 border-l-4 border-blue-300 mb-3 animate-pulse">
                <p className="text-gray-600 italic">{currentSpeech}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm text-gray-700">Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              onChange={(e) => conversation.setVolume({ volume: parseFloat(e.target.value) })}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 