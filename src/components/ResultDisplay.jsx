import React from 'react'

const ResultDisplay = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="form-section">
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner w-6 h-6 border-2 border-slack-primary border-t-transparent rounded-full mr-3"></div>
          <span className="text-slack-text-secondary">Calling Slack API...</span>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const { type, data, error } = result

  return (
    <div className="form-section">
      <h3 className="text-lg font-semibold text-slack-text-primary mb-4">
        Result
      </h3>
      
      {type === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-slack-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-slack-success mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-slack-success">
                Reaction added successfully!
              </h4>
              <div className="mt-2 text-sm text-green-700">
                <p>The emoji reaction has been added to the message.</p>
                {data && data.ok && (
                  <div className="mt-3 p-3 bg-white rounded-slack border border-green-200">
                    <p className="font-medium text-xs text-green-800">API Response:</p>
                    <pre className="text-xs text-green-700 mt-1 overflow-x-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-slack-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-slack-error mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-slack-error">
                Failed to add reaction
              </h4>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-2">{error}</p>
                
                {/* Common error scenarios and solutions */}
                <div className="mt-3 p-3 bg-white rounded-slack border border-red-200">
                  <p className="font-medium text-xs text-red-800 mb-2">Common Solutions:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• Check that your OAuth token is valid and has the necessary permissions</li>
                    <li>• Verify the Channel ID is correct (should start with 'C')</li>
                    <li>• Ensure the Message Timestamp is exact (copy from message permalink)</li>
                    <li>• Confirm the emoji name exists in your Slack workspace</li>
                    <li>• Make sure you have permission to react in that channel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultDisplay