/**
 * Validates form data for Slack reaction API call
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing validation errors
 */
export const validateFormData = (formData) => {
  const errors = {}

  // Validate OAuth Token
  if (!formData.token.trim()) {
    errors.token = 'OAuth access token is required'
  } else if (!formData.token.startsWith('xoxp-')) {
    errors.token = 'OAuth token must start with "xoxp-"'
  } else if (formData.token.length < 50) {
    errors.token = 'OAuth token appears to be too short'
  }

  // Validate Channel ID
  if (!formData.channel.trim()) {
    errors.channel = 'Channel ID is required'
  } else if (!formData.channel.match(/^[C][A-Z0-9]{8,}$/)) {
    errors.channel = 'Channel ID must start with "C" followed by alphanumeric characters'
  }

  // Validate Message Timestamp
  if (!formData.timestamp.trim()) {
    errors.timestamp = 'Message timestamp is required'
  } else if (!formData.timestamp.match(/^\d{10}\.\d{6}$/)) {
    errors.timestamp = 'Timestamp must be in format: 1234567890.123456'
  }

  // Validate Emoji Name
  if (!formData.emoji.trim()) {
    errors.emoji = 'Emoji name is required'
  } else if (formData.emoji.includes(':')) {
    errors.emoji = 'Emoji name should not include colons (:)'
  } else if (!formData.emoji.match(/^[a-zA-Z0-9_+-]+$/)) {
    errors.emoji = 'Emoji name can only contain letters, numbers, underscores, plus, and minus signs'
  }

  return errors
}

/**
 * Sanitizes form data before sending to API
 * @param {Object} formData - The form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  return {
    token: formData.token.trim(),
    channel: formData.channel.trim(),
    timestamp: formData.timestamp.trim(),
    emoji: formData.emoji.trim().toLowerCase()
  }
}