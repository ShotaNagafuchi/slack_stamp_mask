import React, { useState, useEffect } from 'react'
import SlackIcon from './components/SlackIcon'
import ReactionForm from './components/ReactionForm'
import AutoModeToggle from './components/AutoModeToggle'
import ResultDisplay from './components/ResultDisplay'
import HelpSection from './components/HelpSection'

// Chrome拡張機能環境かどうかをチェック
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id

// Chrome拡張機能用のストレージフック（開発環境ではlocalStorageを使用）
function useChromeStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)

  // Initialize from storage
  useEffect(() => {
    if (isExtension) {
      // Chrome拡張機能環境
      chrome.storage.local.get([key], (result) => {
        if (result[key] !== undefined) {
          setStoredValue(result[key])
        }
      })
    } else {
      // 開発環境（localStorage使用）
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key])

  // Set value function
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (isExtension) {
        chrome.storage.local.set({ [key]: valueToStore })
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

function App() {
  const [token, setToken] = useState('')
  const [channelId, setChannelId] = useState('')
  const [messageTs, setMessageTs] = useState('')
  const [emoji, setEmoji] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Auto mode state
  const [autoMode, setAutoMode] = useChromeStorage('autoMode', false)
  const [autoModeStatus, setAutoModeStatus] = useState(false)

  // Get auto mode status from background script (extension only)
  useEffect(() => {
    if (isExtension) {
      chrome.runtime.sendMessage({ action: 'getAutoModeStatus' }, (response) => {
        if (response) {
          setAutoModeStatus(response.isActive)
        }
      })
    }
  }, [])

  // Load token from storage on mount
  useEffect(() => {
    if (isExtension) {
      chrome.storage.local.get(['slackToken'], (result) => {
        if (result.slackToken) {
          setToken(result.slackToken)
        }
      })
    } else {
      // 開発環境ではlocalStorageから読み込み
      try {
        const storedToken = localStorage.getItem('slackToken')
        if (storedToken) {
          setToken(storedToken)
        }
      } catch (error) {
        console.error('Error loading token from localStorage:', error)
      }
    }
  }, [])

  const handleAddReaction = async () => {
    if (!token || !channelId || !messageTs || !emoji) {
      setResult({
        success: false,
        message: 'すべてのフィールドを入力してください。'
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      if (isExtension) {
        // Use Chrome extension API
        chrome.runtime.sendMessage({
          action: 'addReaction',
          channelId: channelId,
          messageTs: messageTs,
          emoji: emoji
        }, (response) => {
          if (response && response.success) {
            setResult({
              success: true,
              message: 'リアクションが正常に追加されました！'
            })
            // Clear form on success
            setChannelId('')
            setMessageTs('')
            setEmoji('')
          } else {
            setResult({
              success: false,
              message: `エラー: ${response?.error || 'Unknown error'}`
            })
          }
          setIsLoading(false)
        })
      } else {
        // Fallback for web version (開発環境)
        const response = await fetch('https://slack.com/api/reactions.add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            channel: channelId,
            timestamp: messageTs,
            name: emoji.replace(/:/g, '')
          })
        })

        const data = await response.json()

        if (data.ok) {
          setResult({
            success: true,
            message: 'リアクションが正常に追加されました！'
          })
          setChannelId('')
          setMessageTs('')
          setEmoji('')
        } else {
          setResult({
            success: false,
            message: `エラー: ${data.error}`
          })
        }
        setIsLoading(false)
      }
    } catch (error) {
      setResult({
        success: false,
        message: `ネットワークエラー: ${error.message}`
      })
      setIsLoading(false)
    }
  }

  const handleAutoModeToggle = (enabled) => {
    setAutoMode(enabled)
    
    if (isExtension) {
      if (enabled && token) {
        chrome.runtime.sendMessage({
          action: 'startAutoMode',
          token: token
        }, (response) => {
          if (response && response.success) {
            setAutoModeStatus(true)
            setResult({
              success: true,
              message: '自動モードが開始されました'
            })
          } else {
            setResult({
              success: false,
              message: `自動モード開始エラー: ${response?.error || 'Unknown error'}`
            })
          }
        })
      } else {
        chrome.runtime.sendMessage({
          action: 'stopAutoMode'
        }, (response) => {
          if (response && response.success) {
            setAutoModeStatus(false)
            setResult({
              success: true,
              message: '自動モードが停止されました'
            })
          }
        })
      }
    } else {
      // 開発環境では自動モード機能を無効化
      setResult({
        success: false,
        message: '自動モードはChrome拡張機能でのみ利用できます'
      })
    }
  }

  const handleGetCurrentMessage = async () => {
    if (!isExtension) {
      setResult({
        success: false,
        message: 'この機能はChrome拡張機能でのみ利用できます'
      })
      return
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab.url.includes('slack.com')) {
        setResult({
          success: false,
          message: 'Slackページでこの機能を使用してください'
        })
        return
      }

      chrome.tabs.sendMessage(tab.id, { action: 'getMessageInfo' }, (response) => {
        if (response && response.success) {
          setChannelId(response.channelId || '')
          setMessageTs(response.timestamp || '')
          setResult({
            success: true,
            message: '現在のメッセージ情報を取得しました'
          })
        } else {
          setResult({
            success: false,
            message: 'メッセージ情報を取得できませんでした。メッセージを選択してください。'
          })
        }
      })
    } catch (error) {
      setResult({
        success: false,
        message: `エラー: ${error.message}`
      })
    }
  }

  // トークンを保存する関数
  const saveToken = (newToken) => {
    console.log('saveToken called with:', newToken ? 'Token provided' : 'No token')
    setToken(newToken)
    if (isExtension) {
      console.log('Saving token to chrome.storage.local...')
      chrome.storage.local.set({ slackToken: newToken }, () => {
        console.log('Token saved to chrome.storage.local, notifying background script...')
        // background scriptにトークン保存を通知
        chrome.runtime.sendMessage({
          action: 'tokenSaved',
          token: newToken
        }, (response) => {
          if (response && response.success) {
            console.log('Token saved and background script notified successfully')
          } else {
            console.error('Failed to notify background script:', response?.error)
          }
        })
      })
    } else {
      localStorage.setItem('slackToken', newToken)
      console.log('Token saved to localStorage (development mode)')
    }
  }

  return (
    <div className="min-h-screen bg-slack-surface py-slack-2xl px-slack-lg">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-slack-2xl">
          <div className="flex items-center justify-center mb-slack-lg">
            <SlackIcon className="w-8 h-8 mr-slack-md" />
            <h1 className="text-3xl font-bold text-slack-text-primary">
              Slack Reaction Tool
            </h1>
          </div>
          <p className="text-slack-text-secondary">
            メッセージに絵文字リアクションを追加するツール
          </p>
          {isExtension ? (
            <p className="text-xs text-slack-success mt-slack-sm">
              ✓ Chrome拡張機能モード
            </p>
          ) : (
            <p className="text-xs text-slack-warning mt-slack-sm">
              ⚠ 開発モード（一部機能制限）
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="card-slack p-slack-2xl mb-slack-xl">
          {/* Auto Mode Toggle */}
          <AutoModeToggle 
            enabled={autoModeStatus}
            onToggle={handleAutoModeToggle}
            disabled={!token}
          />

          {/* Manual Reaction Form */}
          <div className="mt-slack-xl">
            <h2 className="text-xl font-semibold text-slack-text-primary mb-slack-lg">
              手動リアクション追加
            </h2>
            
            {/* Quick Get Message Button */}
            {isExtension && (
              <div className="mb-slack-lg">
                <button
                  onClick={handleGetCurrentMessage}
                  className="btn-slack-secondary w-full"
                >
                  現在のメッセージ情報を取得
                </button>
              </div>
            )}
            
            <ReactionForm
              token={token}
              setToken={saveToken}
              channelId={channelId}
              setChannelId={setChannelId}
              messageTs={messageTs}
              setMessageTs={setMessageTs}
              emoji={emoji}
              setEmoji={setEmoji}
              onSubmit={handleAddReaction}
              isLoading={isLoading}
            />
          </div>

          {/* Result Display */}
          {result && (
            <ResultDisplay result={result} />
          )}
        </div>

        {/* Help Section */}
        <HelpSection isExtension={isExtension} />
      </div>
    </div>
  )
}

export default App