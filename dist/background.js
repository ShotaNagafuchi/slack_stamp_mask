// Background script for Slack Reaction Tool
console.log('Slack Reaction Tool: Background script loaded')

// Store for auto stamper
let autoStamper = null
let pollingInterval = null

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addReaction') {
    handleAddReaction(request, sendResponse)
    return true // Keep message channel open for async response
  } else if (request.action === 'startAutoMode') {
    handleStartAutoMode(request.token, sendResponse)
    return true
  } else if (request.action === 'stopAutoMode') {
    handleStopAutoMode(sendResponse)
    return true
  } else if (request.action === 'getAutoModeStatus') {
    sendResponse({ isActive: autoStamper !== null })
  }
})

// Handle adding reaction
async function handleAddReaction(request, sendResponse) {
  try {
    const token = await getStoredToken()
    if (!token) {
      sendResponse({ success: false, error: 'No token found' })
      return
    }

    const response = await fetch('https://slack.com/api/reactions.add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        channel: request.channelId,
        timestamp: request.messageTs,
        name: request.emoji.replace(/:/g, '')
      })
    })

    const data = await response.json()
    
    if (data.ok) {
      sendResponse({ success: true, message: 'Reaction added successfully' })
    } else {
      sendResponse({ success: false, error: data.error })
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message })
  }
}

// Handle starting auto mode
async function handleStartAutoMode(token, sendResponse) {
  try {
    await storeToken(token)
    startAutoStamper(token)
    sendResponse({ success: true, message: 'Auto mode started' })
  } catch (error) {
    sendResponse({ success: false, error: error.message })
  }
}

// Handle stopping auto mode
function handleStopAutoMode(sendResponse) {
  stopAutoStamper()
  sendResponse({ success: true, message: 'Auto mode stopped' })
}

// Auto stamper functionality
class AutoStamper {
  constructor(token) {
    this.token = token
    this.processedMessages = new Set()
    this.userId = null
    this.channels = []
    
    // Predefined rules
    this.rules = [
      {
        name: 'attention',
        keywords: ['@all', '@channel', '@here'],
        emojis: ['eyes', 'alert', 'loudspeaker', 'warning', 'bell']
      },
      {
        name: 'positive',
        keywords: ['お疲れ様', '助かりました', 'ありがとう', 'thanks', 'thank you', 'good job', '素晴らしい', '完璧'],
        emojis: ['clap', 'pray', 'thumbsup', 'heart', 'smile', 'tada', '100']
      }
    ]
  }

  async start() {
    console.log('AutoStamper starting...')
    
    try {
      await this.getUserInfo()
      await this.getChannels()
      this.startPolling()
      console.log('AutoStamper started successfully')
    } catch (error) {
      console.error('Failed to start AutoStamper:', error)
      throw error
    }
  }

  stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
    console.log('AutoStamper stopped')
  }

  async getUserInfo() {
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    
    const data = await response.json()
    if (data.ok) {
      this.userId = data.user_id
    } else {
      throw new Error(data.error)
    }
  }

  async getChannels() {
    const response = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    
    const data = await response.json()
    if (data.ok) {
      this.channels = data.channels.map(channel => channel.id)
    } else {
      throw new Error(data.error)
    }
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      this.checkForNewMessages()
    }, 60000) // Poll every 60 seconds
    
    this.checkForNewMessages() // Initial check
  }

  async checkForNewMessages() {
    console.log('Checking for new messages...')
    
    for (const channelId of this.channels) {
      try {
        await this.checkChannelMessages(channelId)
      } catch (error) {
        console.error(`Error checking channel ${channelId}:`, error)
      }
    }
  }

  async checkChannelMessages(channelId) {
    const response = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    
    const data = await response.json()
    if (data.ok && data.messages) {
      for (const message of data.messages) {
        await this.processMessage(channelId, message)
      }
    }
  }

  async processMessage(channelId, message) {
    if (this.processedMessages.has(message.ts) || message.user === this.userId) {
      return
    }

    const messageTime = parseFloat(message.ts) * 1000
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    if (messageTime < oneHourAgo) {
      return
    }

    const matchedRule = this.checkRules(message.text)
    if (matchedRule) {
      this.processedMessages.add(message.ts)
      
      const delay = this.getRandomDelay()
      console.log(`Scheduling reaction for message ${message.ts} in ${delay}ms`)
      
      setTimeout(() => {
        this.addReaction(channelId, message.ts, matchedRule)
      }, delay)
    }
  }

  checkRules(text) {
    if (!text) return null
    
    const lowerText = text.toLowerCase()
    
    for (const rule of this.rules) {
      for (const keyword of rule.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return rule
        }
      }
    }
    
    return null
  }

  getRandomDelay() {
    const minDelay = 5 * 60 * 1000 // 5 minutes
    const maxDelay = 15 * 60 * 1000 // 15 minutes
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
  }

  async addReaction(channelId, messageTs, rule) {
    try {
      const emoji = rule.emojis[Math.floor(Math.random() * rule.emojis.length)]
      
      const response = await fetch('https://slack.com/api/reactions.add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          channel: channelId,
          timestamp: messageTs,
          name: emoji
        })
      })
      
      const data = await response.json()
      if (data.ok) {
        console.log(`Added reaction ${emoji} to message ${messageTs}`)
      } else {
        console.error(`Failed to add reaction: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }
}

// Storage functions
async function storeToken(token) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ slackToken: token }, resolve)
  })
}

async function getStoredToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['slackToken'], (result) => {
      resolve(result.slackToken)
    })
  })
}

// Auto stamper management
function startAutoStamper(token) {
  if (autoStamper) {
    autoStamper.stop()
  }
  
  autoStamper = new AutoStamper(token)
  autoStamper.start()
}

function stopAutoStamper() {
  if (autoStamper) {
    autoStamper.stop()
    autoStamper = null
  }
}

// Initialize on extension load
chrome.runtime.onStartup.addListener(() => {
  console.log('Slack Reaction Tool: Extension started')
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Slack Reaction Tool: Extension installed')
}) 