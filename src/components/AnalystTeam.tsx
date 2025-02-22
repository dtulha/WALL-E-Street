'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const analysts = [
  {
    id: 'warren-buffett',
    name: 'Warren Buffett',
    avatar: '/avatars/warren-pixar.jpg',
    specialty: 'Value Investing',
    description: 'Focuses on companies with strong fundamentals, sustainable competitive advantages, and long-term growth potential.',
    status: 'idle',
  },
  {
    id: 'cathie-wood',
    name: 'Cathie Wood',
    avatar: '/avatars/cathie-pixar.jpg',
    specialty: 'Innovation & Growth',
    description: 'Specializes in disruptive innovation, emerging technologies, and high-growth opportunities in transformative sectors.',
    status: 'idle',
  },
  {
    id: 'ben-graham',
    name: 'Ben Graham',
    avatar: '/avatars/ben-pixar.jpg',
    specialty: 'Fundamental Analysis',
    description: 'Expert in quantitative analysis, margin of safety principles, and identifying undervalued securities.',
    status: 'idle',
  },
  {
    id: 'bill-ackman',
    name: 'Bill Ackman',
    avatar: '/avatars/bill-pixar.jpg',
    specialty: 'Activist Investing',
    description: 'Focuses on special situations, corporate governance, and catalysts for value creation through strategic changes.',
    status: 'idle',
  },
]

export default function AnalystTeam() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {analysts.map((analyst) => (
        <motion.div
          key={analyst.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-16 w-16">
              <Image
                src={analyst.avatar}
                alt={analyst.name}
                fill
                className="rounded-full object-cover"
                sizes="64px"
                priority
              />
              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                analyst.status === 'thinking' ? 'animate-pulse bg-amber-400' : 
                analyst.status === 'speaking' ? 'animate-pulse bg-emerald-400' : 
                'bg-blue-400'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{analyst.name}</h3>
              <p className="text-sm font-medium text-primary">{analyst.specialty}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{analyst.description}</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  )
} 