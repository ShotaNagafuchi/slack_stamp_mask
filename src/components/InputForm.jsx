import React, { useState } from 'react'
import { validateFormData } from '../utils/validation'

const InputForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    token: '',
    channel: '',
    timestamp: '',
    emoji: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form data
    const validationErrors = validateFormData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Clear any existing errors
    setErrors({})
    
    // Submit the form
    await onSubmit(formData)
  }

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-slack-text-primary mb-6">
        Add Reaction to Message
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OAuth Access Token */}
        <div className="form-field">
          <label htmlFor="token" className="form-label">
            OAuth Access Token
          </label>
          <input
            id="token"
            type="password"
            className="input-slack"
            placeholder="xoxp-xxxxxxxxx-xxxxxxxxx-xxxxxxxxx-xxxxxxxx"
            value={formData.token}
            onChange={(e) => handleInputChange('token', e.target.value)}
            disabled={isLoading}
            aria-describedby="token-error"
          />
          {errors.token && (
            <div id="token-error" className="error-slack" role="alert">
              {errors.token}
            </div>
          )}
          <p className="text-slack-text-tertiary text-xs mt-1">
            Your OAuth token starting with "xoxp-". This is kept client-side only.
          </p>
        </div>

        {/* Channel ID */}
        <div className="form-field">
          <label htmlFor="channel" className="form-label">
            Channel ID
          </label>
          <input
            id="channel"
            type="text"
            className="input-slack"
            placeholder="C1234567890"
            value={formData.channel}
            onChange={(e) => handleInputChange('channel', e.target.value)}
            disabled={isLoading}
            aria-describedby="channel-error"
          />
          {errors.channel && (
            <div id="channel-error" className="error-slack" role="alert">
              {errors.channel}
            </div>
          )}
          <p className="text-slack-text-tertiary text-xs mt-1">
            The channel ID where the message is located (e.g., C1234567890)
          </p>
        </div>

        {/* Message Timestamp */}
        <div className="form-field">
          <label htmlFor="timestamp" className="form-label">
            Message Timestamp (TS)
          </label>
          <input
            id="timestamp"
            type="text"
            className="input-slack"
            placeholder="1234567890.123456"
            value={formData.timestamp}
            onChange={(e) => handleInputChange('timestamp', e.target.value)}
            disabled={isLoading}
            aria-describedby="timestamp-error"
          />
          {errors.timestamp && (
            <div id="timestamp-error" className="error-slack" role="alert">
              {errors.timestamp}
            </div>
          )}
          <p className="text-slack-text-tertiary text-xs mt-1">
            The message timestamp (found in message permalink or API responses)
          </p>
        </div>

        {/* Emoji Name */}
        <div className="form-field">
          <label htmlFor="emoji" className="form-label">
            Emoji Name
          </label>
          <input
            id="emoji"
            type="text"
            className="input-slack"
            placeholder="thumbsup"
            value={formData.emoji}
            onChange={(e) => handleInputChange('emoji', e.target.value)}
            disabled={isLoading}
            aria-describedby="emoji-error"
          />
          {errors.emoji && (
            <div id="emoji-error" className="error-slack" role="alert">
              {errors.emoji}
            </div>
          )}
          <p className="text-slack-text-tertiary text-xs mt-1">
            Emoji name without colons (e.g., "thumbsup", "heart", "fire")
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-slack-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="submit-status"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Adding Reaction...
              </>
            ) : (
              'Add Reaction'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputForm