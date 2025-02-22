'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Mic, Send, StopCircle } from 'lucide-react'
import Image from 'next/image'

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

const analysts = [
  {
    name: 'Warren Buffett',
    avatar: '/avatars/warren-pixar.jpg',
    thinking: 'Analyzing financial statements and cash flows...',
  },
  {
    name: 'Cathie Wood',
    avatar: '/avatars/cathie-pixar.jpg',
    thinking: 'Evaluating technological disruption potential...',
  },
  {
    name: 'Ben Graham',
    avatar: '/avatars/ben-pixar.jpg',
    thinking: 'Calculating margin of safety...',
  },
  {
    name: 'Bill Ackman',
    avatar: '/avatars/bill-pixar.jpg',
    thinking: 'Assessing strategic value creation opportunities...',
  },
]

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
      const analystResponses = analysts.map((analyst) => ({
        id: Date.now().toString() + analyst.name,
        content: `Based on my analysis of ${content.toLowerCase()}, here are my insights...`,
        type: 'analyst' as const,
        analyst: {
          name: analyst.name,
          avatar: analyst.avatar,
        },
        chainOfThought: [
          analyst.thinking.replace('...', ''),
          "Evaluating market trends...",
          "Forming investment thesis...",
        ],
      }))
      
      setMessages((prev) => [...prev, ...analystResponses])
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
                    <div className="relative h-5 w-5">
                      <Image
                        src={message.analyst.avatar}
                        alt={message.analyst.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="20px"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{message.analyst.name}</span>
                  </div>
                )}
                <p className={`text-sm leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                  {message.content}
                </p>
                {message.chainOfThought && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <p className="mb-1 text-xs font-medium text-gray-700">Analysis:</p>
                    {message.chainOfThought.map((thought, index) => (
                      <p key={index} className="text-xs text-gray-700">
                        {index + 1}. {thought}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isAnalyzing && (
            <div className="space-y-3">
              {analysts.map((analyst, index) => (
                <motion.div
                  key={analyst.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-2"
                >
                  <div className="relative h-6 w-6">
                    <Image
                      src={analyst.avatar}
                      alt={analyst.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="24px"
                    />
                  </div>
                  <div className="rounded-lg bg-gray-800 p-3">
                    <p className="text-sm font-medium text-white">{analyst.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '200ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '400ms' }} />
                      </div>
                      <span className="text-sm text-white">{analyst.thinking}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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