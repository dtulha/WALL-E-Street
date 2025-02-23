'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Link, Mic, Send, StopCircle, FileText, Copy, MessageCircle, X } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { 
  ApiClient, 
  HedgeFundResponse, 
  AnalystResponse, 
  PortfolioManagerResponse,
  ApiError 
} from '@/lib/api'
import jsPDF from 'jspdf'
import ElevenLabsConversation from './ElevenLabsConversation'

interface ErrorDetail {
  title: string;
  message: string;
  error: string;
  traceback: string;
}

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

const ANALYSTS = [
  {
    id: 'Warren Buffett',
    name: 'Warren Buffett',
    avatar: '/avatars/warren-pixar.jpg',
    thinking: 'Analyzing financial statements and cash flows...',
  },
  {
    id: 'Cathie Wood',
    name: 'Cathie Wood',
    avatar: '/avatars/cathie-pixar.jpg',
    thinking: 'Evaluating technological disruption potential...',
  },
  {
    id: 'Ben Graham',
    name: 'Ben Graham',
    avatar: '/avatars/ben-pixar.jpg',
    thinking: 'Calculating margin of safety...',
  },
  {
    id: 'Bill Ackman',
    name: 'Bill Ackman',
    avatar: '/avatars/bill-pixar.jpg',
    thinking: 'Assessing strategic value creation opportunities...',
  },
  {
    id: 'Portfolio Manager',
    name: 'Portfolio Manager',
    avatar: '/avatars/wall-e.jpeg',
    thinking: 'Synthesizing analyst recommendations...',
  },
] as const;

// Simple regex to match stock tickers (1-5 uppercase letters)
const TICKER_REGEX = /\b[A-Z]{1,5}\b/g;

// Add type guard functions at the top level
function isPortfolioManagerResponse(
  response: AnalystResponse | PortfolioManagerResponse
): response is PortfolioManagerResponse {
  return 'decisions' in response;
}

function isAnalystResponse(
  response: AnalystResponse | PortfolioManagerResponse
): response is AnalystResponse {
  return 'signals' in response && !('decisions' in response);
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentResults, setCurrentResults] = useState<ResearchResults | null>(null)
  const [error, setError] = useState<ErrorDetail | null>(null)
  const [showElevenLabsConversation, setShowElevenLabsConversation] = useState(false)

  const extractTickers = (text: string): string[] => {
    const matches = text.match(TICKER_REGEX) || [];
    return [...new Set(matches)]; // Remove duplicates
  };

  const handleSend = useCallback(async (content: string = input) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setIsAnalyzing(true)

    try {
      // First check if the API is healthy
      try {
        await ApiClient.checkHealth();
      } catch (err) {
        throw new ApiError('API Server Not Running', {
          message: 'The API server is not responding',
          error: 'Please make sure the FastAPI server is running:\nrun `uvicorn src.backend.api:app --reload --port 8000`',
          traceback: '',
        });
      }

      // Extract tickers from the message
      const tickers = extractTickers(content.toUpperCase());
      
      if (tickers.length > 0) {
        try {
          // Make API call to analyze stocks
          const result = await ApiClient.analyzeStocks({
            tickers,
          });

          const analystResponses: Message[] = [];

          // Create response messages for each analyst
          Object.entries(result).forEach(([analystName, analysis]) => {
            const analyst = ANALYSTS.find(a => a.name === analystName);
            if (!analyst) return;

            if (analystName === 'Portfolio Manager' && isPortfolioManagerResponse(analysis)) {
              // Create portfolio manager summary message
              const decisions = analysis.decisions;
              tickers.forEach(ticker => {
                const decision = decisions[ticker];
                if (!decision) return;

                analystResponses.push({
                  id: Date.now().toString() + analyst.id + ticker,
                  content: `${ticker}: ${decision.action.toUpperCase()} - ${decision.reasoning}`,
                  type: 'analyst',
                  analyst: {
                    name: analyst.name,
                    avatar: analyst.avatar,
                  },
                  chainOfThought: [
                    `Action: ${decision.action.toUpperCase()}`,
                    `Quantity: ${decision.quantity} shares`,
                    `Confidence: ${(decision.confidence || 0)}%`,
                  ].filter(Boolean) as string[],
                });
              });
            } else if (isAnalystResponse(analysis)) {
              // Create individual analyst messages
              if (analysis.signals) {
                tickers.forEach(ticker => {
                  const signal = analysis.signals![ticker];
                  if (!signal) return;

                  analystResponses.push({
                    id: Date.now().toString() + analyst.id + ticker,
                    content: `${ticker}: ${signal.signal.toUpperCase()} - ${signal.reasoning}`,
                    type: 'analyst',
                    analyst: {
                      name: analyst.name,
                      avatar: analyst.avatar,
                    },
                    chainOfThought: [
                      `Signal: ${signal.signal.toUpperCase()}`,
                      `Confidence: ${(signal.confidence || 0)}%`,
                    ].filter(Boolean) as string[],
                  });
                });
              }
            }
          });

          setMessages(prev => [...prev, ...analystResponses]);
          setCurrentResults({
            query: content,
            responses: analystResponses.map(response => ({
              analyst: {
                name: response.analyst?.name || '',
                avatar: response.analyst?.avatar || '',
              },
              content: response.content,
              chainOfThought: response.chainOfThought,
            })),
            timestamp: new Date().toLocaleString(),
          });

        } catch (err) {
          if (err instanceof ApiError) {
            setError({
              title: err.message,
              message: err.details?.message || 'An error occurred while analyzing stocks',
              error: err.details?.error || 'Unknown error',
              traceback: err.details?.traceback || '',
            });
          } else {
            setError({
              title: 'Error',
              message: 'An unexpected error occurred',
              error: err instanceof Error ? err.message : 'Unknown error',
              traceback: '',
            });
          }
        }
      } else {
        // If no tickers found, provide a helpful message
        const helpMessage: Message = {
          id: Date.now().toString(),
          content: "I can help you analyze stocks! Just mention any stock ticker (e.g., AAPL, MSFT, GOOGL) in your message.",
          type: 'analyst',
          analyst: {
            name: 'System',
            avatar: '/avatars/wall-e.svg',
          },
        };
        setMessages((prev) => [...prev, helpMessage]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError({
          title: err.message,
          message: err.details?.message || 'An error occurred while sending the message',
          error: err.details?.error || 'Unknown error',
          traceback: err.details?.traceback || '',
        });
      } else {
        setError({
          title: 'Error',
          message: 'An unexpected error occurred',
          error: err instanceof Error ? err.message : 'Unknown error',
          traceback: '',
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [input]);

  useEffect(() => {
    const handleSuggestion = (e: CustomEvent<string>) => {
      handleSend(e.detail)
    }

    window.addEventListener('useSuggestion', handleSuggestion as EventListener)
    return () => window.removeEventListener('useSuggestion', handleSuggestion as EventListener)
  }, [handleSend])

  const handleExportToGoogleDocs = async () => {
    if (!currentResults) return;

    try {
      const response = await fetch('/api/google-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentResults.query,
          responses: currentResults.responses,
        }),
      });

      const data = await response.json();

      if (data.needsAuth) {
        // Redirect to Google auth
        window.location.href = data.authUrl;
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export to Google Docs');
      }

      // Open the document in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error exporting to Google Docs:', error);
      setError({
        title: 'Export Failed',
        message: 'Failed to export to Google Docs',
        error: error instanceof Error ? error.message : 'Unknown error',
        traceback: '',
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (!currentResults) return
    const text = `Research Query: ${currentResults.query}\n\n` +
      currentResults.responses.map(response => 
        `${response.analyst?.name}:\n${response.content}\n\nAnalysis:\n${response.chainOfThought?.join('\n')}\n`
      ).join('\n---\n')
    navigator.clipboard.writeText(text)
  }

  const handleExportToPDF = () => {
    if (!currentResults) return
    
    const doc = new jsPDF()
    let yPos = 20

    // Add title
    doc.setFontSize(16)
    doc.text('Research Results', 20, yPos)
    yPos += 10

    // Add query and timestamp
    doc.setFontSize(12)
    doc.text(`Query: ${currentResults.query}`, 20, yPos)
    yPos += 10
    doc.text(`Generated on: ${currentResults.timestamp}`, 20, yPos)
    yPos += 20

    // Add responses
    currentResults.responses.forEach((response) => {
      // Add analyst name
      doc.setFontSize(14)
      doc.text(response.analyst?.name || '', 20, yPos)
      yPos += 10

      // Add content
      doc.setFontSize(12)
      const contentLines = doc.splitTextToSize(response.content, 170)
      doc.text(contentLines, 20, yPos)
      yPos += contentLines.length * 7

      // Add chain of thought
      if (response.chainOfThought) {
        doc.text('Key Points:', 20, yPos)
        yPos += 10
        response.chainOfThought.forEach((thought) => {
          const thoughtLines = doc.splitTextToSize(`• ${thought}`, 170)
          doc.text(thoughtLines, 20, yPos)
          yPos += thoughtLines.length * 7
        })
      }

      yPos += 10

      // Add new page if needed
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
    })

    // Save the PDF
    doc.save(`research-results-${new Date().toISOString().split('T')[0]}.pdf`)
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
                {ANALYSTS.map((analyst, index) => (
                  <motion.div
                    key={analyst.id}
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
                  onClick={handleExportToPDF}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <FileText className="h-4 w-4" />
                  Export to PDF
                </button>
                <button
                  onClick={() => {
                    setShowResults(false)
                    setShowElevenLabsConversation(true)
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

      <ElevenLabsConversation
        isOpen={showElevenLabsConversation}
        onClose={() => setShowElevenLabsConversation(false)}
        researchContext={currentResults}
      />
    </>
  )
} 