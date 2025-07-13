// Content script for Slack Reaction Tool
console.log('Slack Reaction Tool: Content script loaded')

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMessageInfo') {
    const messageInfo = getCurrentMessageInfo()
    sendResponse(messageInfo)
  } else if (request.action === 'addReaction') {
    addReactionToMessage(request.channelId, request.messageTs, request.emoji)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // Keep message channel open for async response
  }
})

// Get current message information
function getCurrentMessageInfo() {
  // Try to find the currently selected or hovered message
  const messageElement = document.querySelector('[data-ts]') || 
                        document.querySelector('.c-message') ||
                        document.querySelector('[data-qa="message"]')
  
  if (messageElement) {
    const timestamp = messageElement.getAttribute('data-ts')
    const channelId = getChannelId()
    
    return {
      success: true,
      timestamp: timestamp,
      channelId: channelId,
      messageText: messageElement.textContent || ''
    }
  }
  
  return {
    success: false,
    error: 'No message found'
  }
}

// Get channel ID from current page
function getChannelId() {
  // Try different selectors to find channel ID
  const channelIdElement = document.querySelector('[data-channel-id]') ||
                          document.querySelector('[data-qa="channel-name"]')
  
  if (channelIdElement) {
    return channelIdElement.getAttribute('data-channel-id')
  }
  
  // Try to extract from URL
  const url = window.location.href
  const match = url.match(/\/archives\/([A-Z0-9]+)/)
  if (match) {
    return match[1]
  }
  
  return null
}

// Add reaction to message (this would be handled by the background script)
async function addReactionToMessage(channelId, messageTs, emoji) {
  // Send to background script to handle API call
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'addReaction',
      channelId: channelId,
      messageTs: messageTs,
      emoji: emoji
    }, response => {
      if (response && response.success) {
        resolve(response)
      } else {
        reject(new Error(response?.error || 'Failed to add reaction'))
      }
    })
  })
}

// Add context menu for quick reaction
document.addEventListener('contextmenu', (event) => {
  const messageElement = event.target.closest('[data-ts]')
  if (messageElement) {
    // Store message info for context menu
    chrome.storage.local.set({
      contextMessage: {
        timestamp: messageElement.getAttribute('data-ts'),
        channelId: getChannelId(),
        text: messageElement.textContent
      }
    })
  }
}) 