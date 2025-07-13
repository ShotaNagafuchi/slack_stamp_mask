import React from 'react'

const ReactionForm = ({
  token,
  setToken,
  channelId,
  setChannelId,
  messageTs,
  setMessageTs,
  emoji,
  setEmoji,
  onSubmit,
  isLoading
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-slack-lg">
      {/* OAuth Token */}
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-slack-text-primary mb-slack-sm">
          OAuth アクセストークン *
        </label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="xoxb-..."
          className="input-slack"
          required
        />
        <p className="text-xs text-slack-text-tertiary mt-slack-sm">
          トークンはブラウザに保存されません
        </p>
      </div>

      {/* Channel ID */}
      <div>
        <label htmlFor="channelId" className="block text-sm font-medium text-slack-text-primary mb-slack-sm">
          チャンネルID *
        </label>
        <input
          id="channelId"
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="C1234567890"
          className="input-slack"
          required
        />
      </div>

      {/* Message Timestamp */}
      <div>
        <label htmlFor="messageTs" className="block text-sm font-medium text-slack-text-primary mb-slack-sm">
          メッセージタイムスタンプ (TS) *
        </label>
        <input
          id="messageTs"
          type="text"
          value={messageTs}
          onChange={(e) => setMessageTs(e.target.value)}
          placeholder="1234567890.123456"
          className="input-slack"
          required
        />
      </div>

      {/* Emoji */}
      <div>
        <label htmlFor="emoji" className="block text-sm font-medium text-slack-text-primary mb-slack-sm">
          絵文字名 *
        </label>
        <input
          id="emoji"
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder=":thumbsup: または thumbsup"
          className="input-slack"
          required
        />
        <p className="text-xs text-slack-text-tertiary mt-slack-sm">
          コロン（:）は自動的に削除されます
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !token || !channelId || !messageTs || !emoji}
        className={`
          w-full btn-slack-primary
          ${isLoading || !token || !channelId || !messageTs || !emoji 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-slack-primary-hover'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-slack-md h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            処理中...
          </div>
        ) : (
          'リアクション追加'
        )}
      </button>
    </form>
  )
}

export default ReactionForm 