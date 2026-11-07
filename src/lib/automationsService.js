import { supabase, isSupabaseConfigured } from './supabase'
import { runAgent } from './llmAdapter'
import { recordAnalyticsRun } from './useAnalytics'
import { CredentialProtectionError, getOrCreateDeviceKey } from './automationKeyStore'
import { dueWindows, normalizeMissedPolicy, planDueRuns } from './missedRuns'

const STORAGE_KEY = 'oa_automations_v2'
const RUNS_KEY = 'oa_automation_runs_v2'
const VAULT_KEY = 'oa_encrypted_vault_v2'
const EMAIL_LOGS_KEY = 'oa_automation_email_logs_v2'

export const SCHEDULE_PRESETS = [
  {
    value: 'hourly',
    label: 'Every hour',
    cron: '0 * * * *',
    ms: 60 * 60 * 1000,
    description: 'Runs at minute 0 of every hour',
  },
  {
    value: 'daily',
    label: 'Every day (9:00 AM)',
    cron: '0 9 * * *',
    ms: 24 * 60 * 60 * 1000,
    description: 'Runs once a day at 9:00 AM',
  },
  {
    value: 'weekly',
    label: 'Every week (Mon 9:00 AM)',
    cron: '0 9 * * 1',
    ms: 7 * 24 * 60 * 60 * 1000,
    description: 'Runs every Monday at 9:00 AM',
  },
]

// Legacy constants are used only to migrate pre-v2 ciphertext once. New vault
// entries use a random, non-extractable device key stored in IndexedDB.
const LEGACY_ENCRYPTION_SALT = 'ila-pgsodium-salt-2026'
const ENCRYPTION_VERSION = 'v2:'

async function deriveLegacyKey() {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(LEGACY_ENCRYPTION_SALT),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('salt-val-pgsodium'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptSecret(plainText) {
  if (!plainText) return ''
  try {
    const key = await getOrCreateDeviceKey()
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const enc = new TextEncoder()
    const ciphertext = await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    )
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(ciphertext), iv.length)
    return `${ENCRYPTION_VERSION}${bytesToBase64(combined)}`
  } catch (error) {
    if (error instanceof CredentialProtectionError) throw error
    throw new CredentialProtectionError(
      'ENCRYPTION_FAILED',
      'The automation key could not be encrypted and was not saved.',
      error
    )
  }
}

export async function decryptSecret(encryptedValue) {
  if (!encryptedValue) return ''
  if (typeof encryptedValue !== 'string' || !encryptedValue.startsWith(ENCRYPTION_VERSION)) {
    throw new CredentialProtectionError(
      'UNSUPPORTED_CIPHERTEXT',
      'This saved key uses an old or unsupported format. Please re-enter it.'
    )
  }
  try {
    const bytes = base64ToBytes(encryptedValue.slice(ENCRYPTION_VERSION.length))
    if (bytes.length <= 12) throw new Error('Ciphertext is too short')
    const iv = bytes.slice(0, 12)
    const ciphertext = bytes.slice(12)
    const key = await getOrCreateDeviceKey()
    const decrypted = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )
    return new TextDecoder().decode(decrypted)
  } catch (error) {
    if (error instanceof CredentialProtectionError) throw error
    throw new CredentialProtectionError(
      'DECRYPTION_FAILED',
      'This device can no longer decrypt the saved automation key. Please re-enter it.',
      error
    )
  }
}

function bytesToBase64(bytes) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function base64ToBytes(value) {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function decryptLegacySecret(encryptedValue) {
  try {
    const bytes = base64ToBytes(encryptedValue)
    if (bytes.length <= 12) throw new Error('Legacy value is not AES-GCM ciphertext')
    const key = await deriveLegacyKey()
    const decrypted = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes.slice(0, 12) },
      key,
      bytes.slice(12)
    )
    return new TextDecoder().decode(decrypted)
  } catch (error) {
    throw new CredentialProtectionError(
      'LEGACY_KEY_REENTRY_REQUIRED',
      'This legacy automation key cannot be migrated safely. Please re-enter it.',
      error
    )
  }
}

// ── Local Vault for Encrypted Provider Keys ──
function getVault() {
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveVault(vault) {
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault))
  } catch {}
}

export async function storeAutomationKey(automationId, plainKey) {
  if (!plainKey) return
  // Encryption must complete before any persistent write. Protection failures
  // deliberately propagate to the UI; there is no reversible fallback.
  const encrypted = await encryptSecret(plainKey)
  const vault = getVault()
  vault[automationId] = encrypted
  saveVault(vault)

  // v2 keys are device-bound and are never uploaded. Remove any legacy server
  // copy left by an earlier version of the app.
  if (isSupabaseConfigured) {
    try {
      await supabase.from('user_secrets').delete().eq('automation_id', automationId)
    } catch (e) {
      console.warn('Legacy server key cleanup failed:', e)
    }
  }
}

export async function retrieveAutomationKey(automationId) {
  const vault = getVault()
  const encrypted = vault[automationId]

  if (!encrypted) return ''
  if (typeof encrypted === 'string' && encrypted.startsWith(ENCRYPTION_VERSION)) {
    return await decryptSecret(encrypted)
  }

  // Migrate only values that authenticate under the old AES-GCM scheme. A
  // legacy base64 fallback cannot be distinguished safely and requires entry.
  const plainText = await decryptLegacySecret(encrypted)
  vault[automationId] = await encryptSecret(plainText)
  saveVault(vault)
  return plainText
}

export function removeAutomationKey(automationId) {
  const vault = getVault()
  delete vault[automationId]
  saveVault(vault)

  if (isSupabaseConfigured) {
    supabase.from('user_secrets').delete().eq('automation_id', automationId).then()
  }
}

/**
 * Remove credential copies held by scheduled automations.
 * A full clear also removes orphaned vault entries whose automation is gone.
 *
 * @param {string} [provider] limit the clear to this provider
 * @returns {Promise<number>} number of affected automations
 */
export async function clearAutomationKeys(provider) {
  const automations = loadAutomations()
  const vault = getVault()
  const affected = automations.filter((automation) => !provider || automation.provider === provider)
  const affectedIds = new Set(affected.map((automation) => automation.id))
  const clearedCount = affected.filter(
    (automation) => automation.hasKey || Object.hasOwn(vault, automation.id)
  ).length

  if (provider) {
    affectedIds.forEach((id) => delete vault[id])
    saveVault(vault)
  } else {
    saveVault({})
  }

  saveAutomations(
    automations.map((automation) =>
      affectedIds.has(automation.id) ? { ...automation, hasKey: false } : automation
    )
  )

  if (isSupabaseConfigured && affectedIds.size > 0) {
    try {
      await Promise.all(
        [...affectedIds].map(async (automationId) => {
          const { error } = await supabase
            .from('user_secrets')
            .delete()
            .eq('automation_id', automationId)
          if (error) throw error
        })
      )
    } catch (error) {
      console.warn('Supabase automation key clear failed:', error)
    }
  }

  return clearedCount
}

// ── Email Notification Dispatch (Resend integration / simulation) ──
export async function sendResendNotification({
  to,
  automationName,
  agentName,
  output,
  status,
  duration,
  error,
}) {
  const logEntry = {
    id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    to,
    automationName,
    agentName,
    status: status === 'failed' ? 'Failed' : 'Delivered',
    sentAt: Date.now(),
    subject: `[Open Agents Hub] ${status === 'failed' ? 'Failed' : 'Completed'}: ${automationName}`,
    preview: output ? output.slice(0, 180) + '...' : error || 'Run finished',
  }

  // Save to local email delivery log
  let existingLogs = []
  try {
    const parsedLogs = JSON.parse(localStorage.getItem(EMAIL_LOGS_KEY) || '[]')
    if (Array.isArray(parsedLogs)) existingLogs = parsedLogs
  } catch {}
  try {
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify([logEntry, ...existingLogs].slice(0, 50)))
  } catch {}

  // Check if Resend API key is available in environment
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY
  if (resendApiKey && to) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Open Agents Hub <automations@openagentshub.dev>',
          to: [to],
          subject: logEntry.subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000000;">
              <div style="border-bottom: 2px solid #E5E5E5; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #000000;">Open Agents Hub Autopilot Report</h2>
                <p style="margin: 4px 0 0 0; color: #9E9E9E; font-size: 14px;">Automation: <strong>${automationName}</strong> (${agentName})</p>
              </div>
              <div style="background: #FAFAFA; border: 1px solid #E4E4E4; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: ${status === 'failed' ? '#919191' : '#C7C7C7'}; font-weight: 600;">${status.toUpperCase()}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Execution Time:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Duration:</strong> ${(duration / 1000).toFixed(2)}s</p>
              </div>
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #000000;">Agent Output</h3>
                <div style="background: #ffffff; border: 1px solid #D4D4D4; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${output || error || 'No output generated.'}
                </div>
              </div>
              <p style="font-size: 12px; color: #737373; text-align: center; margin-top: 30px;">
                Sent automatically by Open Agents Hub Scheduled Automations. Key protected with device-bound AES-GCM.
              </p>
            </div>
          `,
        }),
      })
    } catch (e) {
      console.warn('Resend API dispatch error:', e)
    }
  }

  return logEntry
}

export function getEmailLogs() {
  try {
    return JSON.parse(localStorage.getItem(EMAIL_LOGS_KEY) || '[]')
  } catch {
    return []
  }
}

// ── Default Seed Automations if empty ──
const INITIAL_SEED_AUTOMATIONS = [
  {
    id: 'auto_tech_seo_daily',
    name: 'Daily Blog SEO & Keyword Strategy',
    agentId: '10',
    agentName: 'Blog Post SEO Optimizer',
    category: 'Marketing',
    provider: 'openai',
    model: 'gpt-4o-mini',
    schedule: 'daily',
    cron: '0 9 * * *',
    enabled: true,
    inputs: {
      draft:
        'Top emerging AI agents and automated workflow frameworks in 2026 for developer productivity.',
      keywords: 'AI agents, automation, developer tools, LLM workflows',
    },
    systemPrompt:
      'You are an expert SEO optimizer. Enhance content with high-intent keywords, meta tags, and structured headers.',
    emailNotification: true,
    notificationEmail: 'user@example.com',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastRunAt: Date.now() - 4 * 60 * 60 * 1000,
    nextRunAt: Date.now() + 20 * 60 * 60 * 1000,
    hasKey: true,
  },
  {
    id: 'auto_code_review_hourly',
    name: 'Hourly Code Hygiene & Complexity Audit',
    agentId: '16',
    agentName: 'Code Complexity Analyzer',
    category: 'Engineering',
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    schedule: 'hourly',
    cron: '0 * * * *',
    enabled: true,
    inputs: {
      code: 'function processQueue(tasks) { return tasks.filter(t => t.active).map(t => t.execute()); }',
    },
    systemPrompt: 'Analyze code cyclomatic complexity and suggest safe refactoring.',
    emailNotification: false,
    notificationEmail: '',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastRunAt: Date.now() - 25 * 60 * 1000,
    nextRunAt: Date.now() + 35 * 60 * 1000,
    hasKey: true,
  },
]

const INITIAL_SEED_RUNS = [
  {
    id: 'run_seed_1',
    automationId: 'auto_tech_seo_daily',
    automationName: 'Daily Blog SEO & Keyword Strategy',
    agentName: 'Blog Post SEO Optimizer',
    status: 'success',
    startedAt: Date.now() - 4 * 60 * 60 * 1000,
    completedAt: Date.now() - 4 * 60 * 60 * 1000 + 3200,
    duration: 3200,
    tokens: 480,
    output: `# Optimized SEO Strategy: AI Agents & Developer Autopilot 2026

## Target Keywords
- Primary: **AI Agents for Developers 2026** (Vol: 18.2K, KD: 34%)
- Secondary: *Automated LLM Workflows*, *Autonomous Developer Productivity*

## Meta Title & Description
- **Title**: 10 Best AI Agents & Autopilot Workflows for Developers in 2026
- **Meta Description**: Recurring AI agent automations and encrypted keys for automating code reviews, SEO, and study schedules.

## Header Hierarchy
1. \`# 10 Best AI Agents for 2026\`
2. \`## Why Scheduled Autopilots Change Software Engineering\`
3. \`### Security & Device-bound Key Protection (AES-GCM)\`
4. \`## Conclusion & Next Steps\`
`,
    error: null,
    emailSent: true,
  },
  {
    id: 'run_seed_2',
    automationId: 'auto_code_review_hourly',
    automationName: 'Hourly Code Hygiene & Complexity Audit',
    agentName: 'Code Complexity Analyzer',
    status: 'success',
    startedAt: Date.now() - 25 * 60 * 1000,
    completedAt: Date.now() - 25 * 60 * 1000 + 1950,
    duration: 1950,
    tokens: 240,
    output: `### Code Complexity Analysis Report
- **Cyclomatic Complexity**: 2 (Low - Excellent)
- **Maintainability Index**: 88/100
- **Cognitive Load**: Minimal

#### Recommendations
- The function is clean and functional. Consider handling asynchronous tasks with \`Promise.allSettled\` if \`execute()\` returns a promise.
`,
    error: null,
    emailSent: false,
  },
]

// ── Local Storage Load & Save Helpers ──
export function loadAutomations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_AUTOMATIONS))
      return INITIAL_SEED_AUTOMATIONS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_SEED_AUTOMATIONS
  }
}

export function saveAutomations(automations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(automations))
  } catch {}
}

export function loadRuns() {
  try {
    const raw = localStorage.getItem(RUNS_KEY)
    if (!raw) {
      localStorage.setItem(RUNS_KEY, JSON.stringify(INITIAL_SEED_RUNS))
      return INITIAL_SEED_RUNS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_SEED_RUNS
  }
}

export function saveRuns(runs) {
  try {
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs))
  } catch {}
}

// ── Automation CRUD Operations ──
export async function createAutomation(data) {
  const now = Date.now()
  const preset = SCHEDULE_PRESETS.find((p) => p.value === data.schedule) || SCHEDULE_PRESETS[1]
  const id = `auto_${now}_${Math.random().toString(36).slice(2, 7)}`

  const newAutomation = {
    id,
    name: data.name || `${data.agentName} Automation`,
    agentId: data.agentId,
    agentName: data.agentName,
    category: data.category || 'General',
    provider: data.provider || 'openai',
    model: data.model || 'gpt-4o',
    schedule: data.schedule || 'daily',
    cron: preset.cron,
    missedPolicy: normalizeMissedPolicy(data.missedPolicy),
    enabled: data.enabled ?? true,
    inputs: data.inputs || {},
    systemPrompt: data.systemPrompt || '',
    emailNotification: Boolean(data.emailNotification),
    notificationEmail: data.notificationEmail || '',
    createdAt: now,
    lastRunAt: null,
    nextRunAt: now + preset.ms,
    hasKey: Boolean(data.apiKey),
  }

  if (data.apiKey) {
    await storeAutomationKey(id, data.apiKey)
  }

  const existing = loadAutomations()
  const updated = [newAutomation, ...existing]
  saveAutomations(updated)

  if (isSupabaseConfigured) {
    try {
      await supabase.from('automations').insert({
        id: newAutomation.id,
        name: newAutomation.name,
        agent_id: newAutomation.agentId,
        agent_name: newAutomation.agentName,
        category: newAutomation.category,
        provider: newAutomation.provider,
        model: newAutomation.model,
        schedule: newAutomation.schedule,
        cron: newAutomation.cron,
        enabled: newAutomation.enabled,
        inputs: newAutomation.inputs,
        email_notification: newAutomation.emailNotification,
        notification_email: newAutomation.notificationEmail,
        created_at: new Date(newAutomation.createdAt).toISOString(),
        next_run_at: new Date(newAutomation.nextRunAt).toISOString(),
      })
    } catch (e) {
      console.warn('Supabase automation insert error:', e)
    }
  }

  return newAutomation
}

export async function updateAutomation(id, updates) {
  const existing = loadAutomations()
  const index = existing.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Automation not found')

  if (updates.apiKey) {
    await storeAutomationKey(id, updates.apiKey)
    updates.hasKey = true
    delete updates.apiKey
  }

  if (updates.schedule && updates.schedule !== existing[index].schedule) {
    const preset = SCHEDULE_PRESETS.find((p) => p.value === updates.schedule)
    if (preset) {
      updates.cron = preset.cron
      updates.nextRunAt = Date.now() + preset.ms
    }
  }

  if ('missedPolicy' in updates) {
    updates.missedPolicy = normalizeMissedPolicy(updates.missedPolicy)
  }

  // Resuming a paused automation starts a new schedule. The time it was paused is not "missed".
  if (updates.enabled === true && !existing[index].enabled && !('nextRunAt' in updates)) {
    const schedule = updates.schedule || existing[index].schedule
    const preset = SCHEDULE_PRESETS.find((p) => p.value === schedule) || SCHEDULE_PRESETS[1]
    if (!(existing[index].nextRunAt > Date.now())) updates.nextRunAt = Date.now() + preset.ms
  }

  const updatedAutomation = { ...existing[index], ...updates, updatedAt: Date.now() }
  existing[index] = updatedAutomation
  saveAutomations(existing)

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('automations')
        .update({
          name: updatedAutomation.name,
          schedule: updatedAutomation.schedule,
          enabled: updatedAutomation.enabled,
          inputs: updatedAutomation.inputs,
          email_notification: updatedAutomation.emailNotification,
          notification_email: updatedAutomation.notificationEmail,
          next_run_at: updatedAutomation.nextRunAt
            ? new Date(updatedAutomation.nextRunAt).toISOString()
            : null,
        })
        .eq('id', id)
    } catch (e) {}
  }

  return updatedAutomation
}

export async function toggleAutomation(id) {
  const existing = loadAutomations()
  const item = existing.find((a) => a.id === id)
  if (!item) return null
  return await updateAutomation(id, { enabled: !item.enabled })
}

export async function deleteAutomation(id) {
  removeAutomationKey(id)
  const existing = loadAutomations()
  saveAutomations(existing.filter((a) => a.id !== id))

  const existingRuns = loadRuns()
  saveRuns(existingRuns.filter((r) => r.automationId !== id))

  if (isSupabaseConfigured) {
    try {
      await supabase.from('automations').delete().eq('id', id)
      await supabase.from('automation_runs').delete().eq('automation_id', id)
    } catch (e) {}
  }
  return true
}

export function getAutomation(id) {
  const list = loadAutomations()
  return list.find((a) => a.id === id) || null
}

export function getRunsForAutomation(automationId) {
  const allRuns = loadRuns()
  return allRuns.filter((r) => r.automationId === automationId)
}

export function deleteRun(runId) {
  const allRuns = loadRuns()
  saveRuns(allRuns.filter((r) => r.id !== runId))
  if (isSupabaseConfigured) {
    supabase.from('automation_runs').delete().eq('id', runId).then()
  }
}

// ── Run Automation Engine ──
const activeRunningIds = new Set()

export async function runAutomationNow(automationId, options = {}) {
  const automation = getAutomation(automationId)
  if (!automation) throw new Error('Automation not found')
  if (activeRunningIds.has(automationId)) throw new Error('This automation is currently executing')

  activeRunningIds.add(automationId)
  const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const startedAt = Date.now()

  // Create running record
  const initialRunRecord = {
    id: runId,
    automationId: automation.id,
    automationName: automation.name,
    agentName: automation.agentName,
    status: 'running',
    startedAt,
    completedAt: null,
    duration: 0,
    tokens: 0,
    output: '',
    error: null,
    emailSent: false,
    // Set when the scheduler runs a window that was due: the time it was due, and whether it was
    // run late to catch up for time the app was closed.
    ...(options.scheduledFor
      ? { scheduledFor: options.scheduledFor, catchUp: Boolean(options.catchUp) }
      : {}),
  }

  const currentRuns = loadRuns()
  saveRuns([initialRunRecord, ...currentRuns])

  let outputContent = ''
  let errorMsg = null
  let tokenCount = 0

  try {
    const apiKey = await retrieveAutomationKey(automation.id)
    if (!apiKey) {
      throw new Error(
        'Encrypted API Key is missing. Please edit this automation and re-enter your API key.'
      )
    }

    // Build user message from saved inputs
    const parts = []
    if (automation.inputs) {
      Object.entries(automation.inputs).forEach(([key, val]) => {
        if (!val || (Array.isArray(val) && val.length === 0)) return
        parts.push(Array.isArray(val) ? `${key}: ${val.join(', ')}` : `${key}: ${val}`)
      })
    }
    const userMessage = parts.length > 0 ? parts.join('\n\n') : 'Execute scheduled agent run.'
    const systemPrompt =
      automation.systemPrompt || 'You are an intelligent AI agent executing a scheduled task.'

    const result = await runAgent({
      provider: automation.provider,
      model: automation.model,
      apiKey,
      systemPrompt,
      userMessage,
    })

    outputContent = result.content
    tokenCount = result.tokens || Math.round((outputContent.length + userMessage.length) / 4)

    recordAnalyticsRun({
      agentId: automation.agentId,
      agentName: automation.agentName,
      category: automation.category || 'Scheduled',
      provider: automation.provider,
      model: automation.model,
      duration: result.duration,
    })
  } catch (err) {
    errorMsg = err.message || (typeof err === 'string' ? err : 'Execution error')
  } finally {
    activeRunningIds.delete(automationId)
  }

  const completedAt = Date.now()
  const duration = completedAt - startedAt
  const status = errorMsg ? 'failed' : 'success'
  let emailSent = false

  // Email Notification if enabled
  if (automation.emailNotification && automation.notificationEmail) {
    try {
      await sendResendNotification({
        to: automation.notificationEmail,
        automationName: automation.name,
        agentName: automation.agentName,
        output: outputContent,
        status,
        duration,
        error: errorMsg,
      })
      emailSent = true
    } catch (e) {
      console.warn('Email dispatch failed:', e)
    }
  }

  // Update run record
  const finishedRunRecord = {
    ...initialRunRecord,
    status,
    completedAt,
    duration,
    tokens: tokenCount,
    output: outputContent,
    error: errorMsg,
    emailSent,
  }

  const allRuns = loadRuns().map((r) => (r.id === runId ? finishedRunRecord : r))
  saveRuns(allRuns)

  // Update automation nextRunAt and lastRunAt. A scheduled run leaves nextRunAt alone: the
  // scheduler moved it past the windows it was handling before it started (see checkDueAutomations).
  const preset =
    SCHEDULE_PRESETS.find((p) => p.value === automation.schedule) || SCHEDULE_PRESETS[1]
  updateAutomation(
    automation.id,
    options.keepSchedule
      ? { lastRunAt: completedAt }
      : { lastRunAt: completedAt, nextRunAt: completedAt + preset.ms }
  )

  // Trigger browser notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(
      status === 'success' ? `${automation.name} Finished` : `${automation.name} Failed`,
      {
        body:
          status === 'success' ? `Output generated in ${(duration / 1000).toFixed(1)}s` : errorMsg,
        icon: '/favicon.ico',
      }
    )
  }

  return finishedRunRecord
}

// ── Missed and skipped scheduled runs ──
function patchAutomation(id, patch) {
  const list = loadAutomations()
  const index = list.findIndex((a) => a.id === id)
  if (index === -1) return
  list[index] = { ...list[index], ...patch }
  saveAutomations(list)
}

// A scheduled window that did not run. `status` is 'missed' when the app was not running at the
// time (closed tab, sleeping machine) and 'skipped' when it was running but could not start the run.
// One record covers a range of windows, so a long absence does not fill the history.
function addUnexecutedRecord(automation, { status, count, first, last, now, policy, reason }) {
  const record = {
    id: `run_${now}_${Math.random().toString(36).slice(2, 7)}`,
    automationId: automation.id,
    automationName: automation.name,
    agentName: automation.agentName,
    status,
    startedAt: last,
    completedAt: now,
    duration: 0,
    tokens: 0,
    output: '',
    error: null,
    emailSent: false,
    ...(status === 'missed' ? { missedCount: count } : { skippedCount: count }),
    firstWindow: first,
    lastWindow: last,
    detectedAt: now,
    policy,
    ...(reason ? { reason } : {}),
  }
  saveRuns([record, ...loadRuns()])
  return record
}

/**
 * Runs what is due at `now`. Called on start-up and then every minute while the app is open.
 *
 * Time is counted from each automation's `nextRunAt`. When the app was closed, several windows can
 * have passed. The automation's missed-run policy decides how many of them to run (see
 * missedRuns.js); the rest are written to the history as missed, so a schedule that quietly
 * produced fewer runs than it promised is visible. Returns what it did, for tests and callers.
 */
export async function checkDueAutomations(now = Date.now()) {
  const handled = []

  for (const item of loadAutomations()) {
    if (!item.enabled) continue
    // A run is already going: leave the windows alone and look again on the next tick.
    if (activeRunningIds.has(item.id)) continue

    const preset = SCHEDULE_PRESETS.find((p) => p.value === item.schedule) || SCHEDULE_PRESETS[1]
    const due = dueWindows({ nextRunAt: item.nextRunAt, intervalMs: preset.ms, now })
    if (!due) continue

    const policy = normalizeMissedPolicy(item.missedPolicy)

    // Move the schedule past these windows and write the history before awaiting anything, so a
    // second tick that starts while the runs below are in progress does not count them again.
    patchAutomation(item.id, { nextRunAt: due.last + preset.ms })

    if (!item.hasKey) {
      // Nothing can run without the key. Say so instead of dropping the windows silently.
      addUnexecutedRecord(item, {
        status: 'skipped',
        count: due.count,
        first: due.first,
        last: due.last,
        now,
        policy,
        reason: 'no_key',
      })
      handled.push({ id: item.id, ran: [], skipped: due.count, missed: 0 })
      continue
    }

    const { runWindows, missed } = planDueRuns(due, policy)
    if (missed) {
      addUnexecutedRecord(item, { status: 'missed', ...missed, now, policy })
    }

    for (const window of runWindows) {
      try {
        await runAutomationNow(item.id, {
          scheduledFor: window,
          catchUp: !(window === due.last && due.lastOnTime),
          keepSchedule: true,
        })
      } catch (e) {
        console.error(`Scheduled run for ${item.name} failed:`, e)
      }
    }
    handled.push({ id: item.id, ran: runWindows, skipped: 0, missed: missed ? missed.count : 0 })
  }

  return handled
}

// ── In-Browser Cron Background Heartbeat ──
let heartbeatInterval = null

export function initAutomationEngine() {
  if (heartbeatInterval) return

  // Check on init
  checkDueAutomations()
  // Check every 60s
  heartbeatInterval = setInterval(checkDueAutomations, 60000)
}
