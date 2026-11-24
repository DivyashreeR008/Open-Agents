import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getRunNotificationPrivacy,
  notifyRun,
  saveRunNotificationPrivacy,
} from './runNotifications'

describe('run notification privacy boundary', () => {
  let notifications
  beforeEach(() => {
    localStorage.clear()
    notifications = []
    vi.stubGlobal(
      'Notification',
      class {
        static permission = 'granted'
        constructor(title, options) {
          this.close = vi.fn()
          notifications.push({ title, options, instance: this })
        }
      }
    )
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it.each([null, 'invalid', 'true', '{"detailed":true}'])(
    'fails private for an unset or invalid preference: %s',
    (value) => {
      if (value !== null) localStorage.setItem('oa_run_notification_privacy', value)
      notifyRun('Medical review', 'Failed: private key fragment')
      expect(getRunNotificationPrivacy()).toBe('private')
      expect(notifications[0]).toMatchObject({
        title: 'OpenAgents update',
        options: { body: 'Open the app to view run details.' },
      })
    }
  )

  it('fails private when storage cannot be read', () => {
    saveRunNotificationPrivacy('detailed')
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    notifyRun('Medical review', 'private key fragment')
    expect(notifications[0].title).toBe('OpenAgents update')
    expect(notifications[0].options.body).toBe('Open the app to view run details.')
  })

  it('reads the current preference for each delivery and can return to private', () => {
    saveRunNotificationPrivacy('detailed')
    notifyRun('Medical review', 'private error')
    saveRunNotificationPrivacy('private')
    notifyRun('Medical review', 'private error')
    expect(notifications.map(({ title }) => title)).toEqual(['Medical review', 'OpenAgents update'])
  })

  it.each(['denied', 'default'])(
    'does not request permission or deliver when permission is %s',
    (permission) => {
      Notification.permission = permission
      Notification.requestPermission = vi.fn()
      notifyRun('Private name', 'Private error')
      expect(notifications).toEqual([])
      expect(Notification.requestPermission).not.toHaveBeenCalled()
    }
  )

  it('supports browsers without notifications', () => {
    delete window.Notification
    expect(() => notifyRun('Private name', 'Private error')).not.toThrow()
  })

  it('does not let a constructor failure invalidate a completed run', () => {
    vi.stubGlobal(
      'Notification',
      class {
        static permission = 'granted'
        constructor() {
          throw new Error('not supported here')
        }
      }
    )
    expect(() => notifyRun('Private name', 'Private error')).not.toThrow()
  })

  it('focuses the app and closes the notification when opened', () => {
    const focus = vi.spyOn(window, 'focus').mockImplementation(() => {})
    notifyRun('Private name', 'Private error')
    notifications[0].instance.onclick()
    expect(focus).toHaveBeenCalledOnce()
    expect(notifications[0].instance.close).toHaveBeenCalledOnce()
  })
})
