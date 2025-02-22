'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Mic, Send, StopCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  type: 'user' | 'analyst'
  analyst?: {
    name: string
    avatar: string
  }
  chainOfThought?: string[]
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const handleSuggestion = (e: CustomEvent<string>) => {
      handleSend(e.detail)
    }

    window.addEventListener('useSuggestion', handleSuggestion as EventListener)
    return () => window.removeEventListener('useSuggestion', handleSuggestion as EventListener)
  }, [])

  const handleSend = async (content: string = input) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setIsAnalyzing(true)

    // TODO: Implement actual API call to process the message
    setTimeout(() => {
      const mockResponse: Message = {
        id: Date.now().toString(),
        content: "Based on our analysis, we believe this stock shows promising fundamentals...",
        type: 'analyst',
        analyst: {
          name: 'Warren Buffett',
          avatar: '/avatars/warren-buffett.svg',
        },
        chainOfThought: [
          "Analyzing financial statements...",
          "Checking competitive advantage...",
          "Evaluating management team...",
        ],
      }
      setMessages((prev) => [...prev, mockResponse])
      setIsAnalyzing(false)
    }, 2000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement actual voice recording logic
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex min-h-[200px] flex-col p-6">
        <div className="flex-1 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100'
              }`}>
                {message.type === 'analyst' && message.analyst && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={message.analyst.avatar}
                      alt={message.analyst.name}
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">{message.analyst.name}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.chainOfThought && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <p className="mb-1 text-xs font-medium text-gray-500">Analysis:</p>
                    {message.chainOfThought.map((thought, index) => (
                      <p key={index} className="text-xs text-gray-500">
                        {index + 1}. {thought}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
              </div>
              <span>Analyzing...</span>
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isRecording ? (
              <>
                <StopCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span className="text-sm font-medium">Talk to the team</span>
              </>
            )}
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-primary">
            <Link className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any company or investment topic..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="rounded-full bg-primary p-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 