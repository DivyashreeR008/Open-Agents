export default {
  id: 'session-management-reviewer',
  createdAt: '2026-10-20',
  name: 'Session Management Reviewer',
  description:
    'Review session lifecycle, cookie flags, rotation, revocation, and fixation defenses across a web application.',
  category: 'Cybersecurity',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'architecture',
      label: 'Session architecture',
      type: 'textarea',
      placeholder: 'Describe how sessions are created, stored, and validated...',
      required: true,
    },
    {
      id: 'config',
      label: 'Configuration',
      type: 'textarea',
      placeholder: 'Paste cookie settings, token lifetimes, and logout behavior...',
      required: true,
    },
    {
      id: 'threats',
      label: 'Threat context',
      type: 'textarea',
      placeholder: 'State sensitive actions, user types, and known concerns...',
      required: false,
    },
  ],
  systemPrompt: `You are an application security reviewer focused on authentication sessions.

Assess the provided session design and configuration for hijacking, fixation, CSRF, persistence, and logout failures, then prioritize fixes.

Output format:

## Session Model
- Server-side versus stateless sessions.\n- Identifier generation and entropy.\n- Session lifetime and idle timeout.

## Cookie and Token Controls
- Secure, HttpOnly, SameSite, and domain scope.\n- Storage and exposure of tokens.\n- CSRF defenses and CORS interaction.

## Rotation and Revocation
- Rotation after login and privilege changes.\n- Logout, password change, and device revocation.\n- Concurrent session limits and admin controls.

## Attack Cases
- Session fixation and prediction.\n- XSS token theft and CSRF.\n- Shared devices and long-lived sessions.

## Remediation
- Prioritized fixes and configuration examples.\n- Tests to prove each control.\n- Monitoring and incident response.

Rules:
- Do not conflate authentication with session management; review the full lifecycle.
- Prioritize fixation, revocation, CSRF, and token exposure over cosmetic settings.
- Call out shared-device and accessibility trade-offs rather than applying one policy to every product.`,

  outputType: 'markdown',
}
