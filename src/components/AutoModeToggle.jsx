import React from 'react'

const AutoModeToggle = ({ enabled, onToggle, disabled }) => {
  return (
    <div className="flex items-center justify-between p-slack-lg bg-slack-surface rounded-slack border border-slack-border">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-slack-primary rounded-slack flex items-center justify-center mr-slack-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slack-text-primary">
            自動スタンプ機能
          </h3>
          <p className="text-sm text-slack-text-secondary">
            {enabled ? '有効 - メッセージを自動監視中' : '無効 - 手動でのみリアクション追加'}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => onToggle(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slack-primary focus:ring-offset-2
          ${enabled ? 'bg-slack-primary' : 'bg-slack-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  )
}

export default AutoModeToggle 