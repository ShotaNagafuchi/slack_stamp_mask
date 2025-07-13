class AutoStamper {
  constructor(token) {
    this.token = token
    this.pollingInterval = null
    this.processedMessages = new Set()
    this.userId = null
    this.channels = []
    
    // Predefined rules and emoji lists
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
      // Get user info
      await this.getUserInfo()
      
      // Get accessible channels
      await this.getChannels()
      
      // Start polling
      this.startPolling()
      
      console.log('AutoStamper started successfully')
    } catch (error) {
      console.error('Failed to start AutoStamper:', error)
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
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      
      const data = await response.json()
      if (data.ok) {
        this.userId = data.user_id
        console.log('User ID:', this.userId)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to get user info:', error)
      throw error
    }
  }

  async getChannels() {
    try {
      const response = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      
      const data = await response.json()
      if (data.ok) {
        this.channels = data.channels.map(channel => channel.id)
        console.log('Accessible channels:', this.channels.length)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to get channels:', error)
      throw error
    }
  }

  startPolling() {
    // Poll every 60 seconds
    this.pollingInterval = setInterval(() => {
      this.checkForNewMessages()
    }, 60000)
    
    // Initial check
    this.checkForNewMessages()
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
    try {
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
    } catch (error) {
      console.error(`Error fetching messages for channel ${channelId}:`, error)
    }
  }

  async processMessage(channelId, message) {
    // Skip if already processed
    if (this.processedMessages.has(message.ts)) {
      return
    }

    // Skip own messages
    if (message.user === this.userId) {
      return
    }

    // Skip messages older than 1 hour
    const messageTime = parseFloat(message.ts) * 1000
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    if (messageTime < oneHourAgo) {
      return
    }

    // Check if message matches any rules
    const matchedRule = this.checkRules(message.text)
    if (matchedRule) {
      // Mark as processed
      this.processedMessages.add(message.ts)
      
      // Schedule reaction with random delay
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
    // Random delay between 5-15 minutes
    const minDelay = 5 * 60 * 1000 // 5 minutes
    const maxDelay = 15 * 60 * 1000 // 15 minutes
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
  }

  async addReaction(channelId, messageTs, rule) {
    try {
      // Select random emoji from rule
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

export { AutoStamper } 