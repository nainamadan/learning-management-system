import React from 'react'

const CallToAction = (props) => {
  return (
    <div className='bg-blue-50 py-10 px-4'>

      {/* InterviewIQ Banner */}
      <div className='max-w-2xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl pax-6 py-8 text-center'>

        <span className='inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide'>
          NEW — InterviewIQ
        </span>

        <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2'>
          Crack your next interview with AI
        </h2>

        <p className='text-sm text-gray-500 max-w-md mx-auto mb-5'>
          Practice mock interviews, get real-time feedback, and receive a detailed performance report — all powered by AI.
        </p>

        {/* Feature chips */}
        <div className='flex flex-wrap gap-2 justify-center mb-6'>
          {['AI Mock Interviews', 'Performance Report', 'All Domains', 'Free to try'].map((chip) => (
            <span key={chip} className='bg-white border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full'>
              {chip}
            </span>
          ))}
        </div>

        {/* Replace href with your actual Vercel URL */}
        <a
          href="https://ai-interview-platform-8f4n.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className='inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition'
        >
          Try InterviewIQ
          <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 16 16'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3 8h10M9 4l4 4-4 4' />
          </svg>
        </a>

      </div>

    </div>
  )
}

export default CallToAction
