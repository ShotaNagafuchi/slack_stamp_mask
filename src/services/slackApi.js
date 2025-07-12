import { sanitizeFormData } from '../utils/validation'

/**
 * Slack API base URL
 */
const SLACK_API_BASE = 'https://slack.com/api'

/**
 * Adds a reaction to a Slack message using the reactions.add API
 * @param {Object} formData - Form data containing token, channel, timestamp, and emoji
 * @returns {Promise<Object>} - API response from Slack
 * @throws {Error} - If the API call fails
 */
export const addReaction = async (formData) => {
  // Sanitize the form data
  const cleanData = sanitizeFormData(formData)
  
  try {
    const response = await fetch(`${SLACK_API_BASE}/reactions.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanData.token}`,
      },
      body: JSON.stringify({
        channel: cleanData.channel,
        timestamp: cleanData.timestamp,
        name: cleanData.emoji,
      }),
    })

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Check if Slack API returned an error
    if (!data.ok) {
      throw new Error(getSlackErrorMessage(data.error))
    }

    return data
  } catch (error) {
    // Handle network errors, CORS issues, etc.
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Unable to connect to Slack API. This might be due to CORS restrictions. ' +
        'Please check your network connection or try using a CORS proxy.'
      )
    }
    
    throw error
  }
}

/**
 * Maps Slack API error codes to user-friendly messages
 * @param {string} errorCode - Slack API error code
 * @returns {string} - User-friendly error message
 */
const getSlackErrorMessage = (errorCode) => {
  const errorMessages = {
    'invalid_auth': 'Invalid OAuth token. Please check your access token.',
    'channel_not_found': 'Channel not found. Please verify the Channel ID.',
    'message_not_found': 'Message not found. Please check the timestamp.',
    'invalid_name': 'Invalid emoji name. Please use a valid emoji name.',
    'already_reacted': 'You have already reacted to this message with this emoji.',
    'no_reaction': 'Unable to add reaction. The emoji might not exist in your workspace.',
    'rate_limited': 'Rate limited. Please wait a moment before trying again.',
    'not_in_channel': 'You are not a member of this channel.',
    'thread_locked': 'This thread is locked and reactions cannot be added.',
    'compliance_exports_prevent_deletion': 'Cannot add reaction due to compliance export restrictions.',
    'ekm_access_denied': 'Access denied due to enterprise key management restrictions.',
    'not_authed': 'No authentication token provided.',
    'account_inactive': 'Authentication token is for a deleted user or workspace.',
    'token_revoked': 'Authentication token has been revoked.',
    'invalid_arg_name': 'The method was passed an argument whose name falls outside the bounds of accepted or expected values.',
    'invalid_arguments': 'The method was either called with invalid arguments or some detail about the arguments passed is invalid.',
    'invalid_array_arg': 'The method was passed an array as an argument.',
    'invalid_charset': 'The method was called via a POST request, but the charset specified in the Content-Type header was invalid.',
    'invalid_form_data': 'The method was called via a POST request with Content-Type application/x-www-form-urlencoded or multipart/form-data, but the form data was either missing or syntactically invalid.',
    'invalid_post_type': 'The method was called via a POST request, but the specified Content-Type was invalid.',
    'missing_post_type': 'The method was called via a POST request and included a data payload, but the request did not include a Content-Type header.',
    'team_added_to_org': 'The workspace associated with your request is currently undergoing migration to an Enterprise Grid organization.',
    'request_timeout': 'The method was called via a POST request, but the POST data was either missing or truncated.',
    'fatal_error': 'The server could not complete your operation(s) without encountering a catastrophic error.',
    'internal_error': 'The server could not complete your operation(s) without encountering an error, likely due to a transient issue on our end.',
  }

  return errorMessages[errorCode] || `Slack API error: ${errorCode}`
}

/**
 * Validates if a Slack OAuth token has the required scopes for reactions.add
 * This is informational only since we can't actually test scopes without making a call
 * @param {string} token - The OAuth token to validate format
 * @returns {boolean} - Whether the token format appears valid
 */
export const isValidTokenFormat = (token) => {
  return token && token.startsWith('xoxp-') && token.length >= 50
}

/**
 * Test the Slack API connection (auth.test endpoint)
 * @param {string} token - OAuth token to test
 * @returns {Promise<Object>} - API response from auth.test
 */
export const testSlackConnection = async (token) => {
  try {
    const response = await fetch(`${SLACK_API_BASE}/auth.test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Unable to test Slack connection: ' + error.message)
  }
}