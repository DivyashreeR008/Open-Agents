export default {
  id: 'port-conflict-resolver',
  createdAt: '2026-10-12',
  name: 'Port Conflict Resolver',
  description:
    'Something squatting on your port? Identify it and free, kill, or relocate it safely.',
  category: 'Developer Tools',
  icon: 'Plug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    port: '3000',
    os: 'macOS',
    process:
      'EADDRINUSE on npm run dev. lsof shows node PID 8123 listening. Docker also maps 3000.',
  },
  inputs: [
    {
      id: 'port',
      label: 'Blocked port',
      type: 'text',
      placeholder: 'e.g. 3000',
      required: true,
    },
    {
      id: 'os',
      label: 'Operating system',
      type: 'select',
      options: ['macOS', 'Linux', 'Windows'],
      defaultValue: 'macOS',
      required: true,
    },
    {
      id: 'process',
      label: 'Error and process clues',
      type: 'textarea',
      placeholder: 'e.g. Paste the EADDRINUSE error, lsof or netstat output, Docker mappings',
    },
  ],
  systemPrompt: `You are a developer support engineer who resolves local port conflicts quickly and safely.

Diagnose the conflict and give OS-specific commands to resolve it.

Output format:

## Diagnosis
Most likely holder of the port based on the clues given.

## Identify commands
Commands for the selected OS to find the PID and process name.

## Resolution options
Free the port, stop the process safely, or relocate your app, with commands.

## Prevention
How to avoid repeat conflicts with env vars, profiles, or compose ports.

## Verification
Command to confirm the port is free and the app starts.

Rules:
- Match all commands to the selected operating system
- Prefer graceful stop over force kill, and say when force is justified
- Warn before killing system or unknown PIDs
- Offer relocate as an option alongside kill
- Do not invent versions, CVEs, or process details not in the inputs
- Keep language neutral and procedural`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'curl-command-builder'],
}
