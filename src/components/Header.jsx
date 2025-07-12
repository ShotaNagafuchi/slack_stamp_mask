import React from 'react'

const Header = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="slack-logo mr-3">
          S
        </div>
        <h1 className="text-3xl font-bold text-slack-text-primary">
          Slack Reaction Tool
        </h1>
      </div>
      <p className="text-slack-text-secondary text-lg">
        Add emoji reactions to messages using your OAuth access token
      </p>
    </header>
  )
}

export default Header