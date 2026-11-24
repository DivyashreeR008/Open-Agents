const PRIVACY_KEY = 'oa_run_notification_privacy'

export function getRunNotificationPrivacy() {
  try {
    return localStorage.getItem(PRIVACY_KEY) === 'detailed' ? 'detailed' : 'private'
  } catch {
    return 'private'
  }
}

export function saveRunNotificationPrivacy(value) {
  localStorage.setItem(PRIVACY_KEY, value === 'detailed' ? 'detailed' : 'private')
}

export function notifyRun(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  const detailed = getRunNotificationPrivacy() === 'detailed'
  try {
    const notification = new Notification(detailed ? title : 'OpenAgents update', {
      body: detailed ? body : 'Open the app to view run details.',
      icon: '/favicon.ico',
    })
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  } catch {
    // Notification delivery must not change the result of an already completed run.
  }
}
