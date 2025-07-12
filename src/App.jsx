import React, { useState } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import ResultDisplay from './components/ResultDisplay'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (formData) => {
    setIsLoading(true)
    setResult(null)
    
    try {
      // Import the API service
      const { addReaction } = await import('./services/slackApi')
      const response = await addReaction(formData)
      setResult({ type: 'success', data: response })
    } catch (error) {
      setResult({ type: 'error', error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slack-surface">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header />
        
        <main className="mt-8 space-y-6">
          <InputForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading}
          />
          
          <ResultDisplay 
            result={result} 
            isLoading={isLoading}
          />
        </main>
        
        <footer className="mt-12 text-center text-slack-text-tertiary text-sm">
          <p>Add emoji reactions to Slack messages using your OAuth access token</p>
          <p className="mt-2">No data is stored or logged • All operations are client-side only</p>
        </footer>
      </div>
    </div>
  )
}

export default App