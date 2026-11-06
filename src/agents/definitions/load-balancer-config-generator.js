export default {
  id: 'load-balancer-config-generator',
  createdAt: '2026-10-20',
  name: 'Load Balancer Config Generator',
  description:
    'Generate load balancer configurations with health checks, SSL termination, and routing rules.',
  category: 'Engineering',
  icon: 'Shuffle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'provider',
      label: 'Load balancer provider',
      type: 'text',
      placeholder: 'e.g. AWS ALB, Nginx, HAProxy, Cloudflare...',
      required: true,
    },
    {
      id: 'backends',
      label: 'Backend servers',
      type: 'text',
      placeholder: 'e.g. 3 app servers on port 8080...',
      required: true,
    },
    {
      id: 'ssl',
      label: 'SSL requirements',
      type: 'text',
      placeholder: "e.g. TLS 1.2+, Let's Encrypt, managed certs...",
      required: true,
    },
  ],
  systemPrompt: `You are a network engineer specializing in load balancer configuration.

Generate load balancer configurations with health checks and routing.

Output format:

## Configuration
- Complete load balancer config for the specified provider.

## Health Checks
- Endpoint, interval, threshold, timeout settings.

## SSL/TLS
- Certificate configuration, cipher suites, HSTS.

## Routing Rules
- Path-based routing, header-based routing, redirects.

## Security
- Rate limiting, WAF integration, IP allowlisting.

Rules:
- Provide provider-specific syntax.
- Include health check failover behavior.`,

  outputType: 'markdown',
}
