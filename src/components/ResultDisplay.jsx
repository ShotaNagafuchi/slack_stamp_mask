import React from 'react'

const ResultDisplay = ({ result }) => {
  if (!result) return null

  return (
    <div className={`mt-slack-lg p-slack-lg rounded-slack border-l-4 ${
      result.success 
        ? 'success-slack' 
        : 'error-slack'
    }`}>
      <div className="flex items-center">
        {result.success ? (
          <svg className="w-5 h-5 mr-slack-md text-slack-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-slack-md text-slack-error" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
        <span className="font-medium">
          {result.message}
        </span>
      </div>
    </div>
  )
}

export default ResultDisplay