'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, Mic, Send, StopCircle, FileText, Copy, MessageCircle, X } from 'lucide-react'
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

interface ResearchResults {
  query: string
  responses: Message[]
  timestamp: string
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
  const [showResults, setShowResults] = useState(false)
  const [currentResults, setCurrentResults] = useState<ResearchResults | null>(null)

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
      setCurrentResults({
        query: content,
        responses: analystResponses,
        timestamp: new Date().toLocaleString(),
      })
    }, 2000)
  }

  const handleExportToGoogleDocs = () => {
    // TODO: Implement Google Docs export
    console.log('Exporting to Google Docs...')
  }

  const handleCopyToClipboard = () => {
    if (!currentResults) return
    const text = `Research Query: ${currentResults.query}\n\n` +
      currentResults.responses.map(response => 
        `${response.analyst?.name}:\n${response.content}\n\nAnalysis:\n${response.chainOfThought?.join('\n')}\n`
      ).join('\n---\n')
    navigator.clipboard.writeText(text)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement actual voice recording logic
  }

  return (
    <>
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
            {!isAnalyzing && currentResults && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowResults(true)}
                  className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
                >
                  See Research Results
                </button>
              </div>
            )}
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

      <AnimatePresence>
        {showResults && currentResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowResults(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            >
              <button
                onClick={() => setShowResults(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="mb-4 text-2xl font-bold text-gray-900">Research Results</h2>
              <p className="mb-2 text-sm text-gray-500">Query: {currentResults.query}</p>
              <p className="mb-4 text-sm text-gray-500">Generated on: {currentResults.timestamp}</p>

              <div className="mb-6 flex gap-3 border-b border-gray-200 pb-4">
                <button
                  onClick={handleExportToGoogleDocs}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <FileText className="h-4 w-4" />
                  Export to Google Docs
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => {
                    setShowResults(false)
                    setInput('Let\'s discuss these research findings')
                  }}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuss with Team
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Consolidated Analysis</h3>
                  <div className="space-y-4">
                    {currentResults.responses.map((response, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="relative h-6 w-6">
                            <Image
                              src={response.analyst?.avatar || ''}
                              alt={response.analyst?.name || ''}
                              fill
                              className="rounded-full object-cover"
                              sizes="24px"
                            />
                          </div>
                          <span className="font-medium text-gray-900">{response.analyst?.name}</span>
                        </div>
                        <p className="text-gray-700">{response.content}</p>
                        {response.chainOfThought && (
                          <div className="mt-2 pl-8">
                            <p className="mb-1 text-sm font-medium text-gray-700">Key Points:</p>
                            {response.chainOfThought.map((thought, i) => (
                              <p key={i} className="text-sm text-gray-600">• {thought}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
} 