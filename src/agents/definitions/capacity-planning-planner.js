export default {
  id: 'capacity-planning-planner',
  createdAt: '2026-10-20',
  name: 'Capacity Planning Planner',
  description:
    'Forecast infrastructure and team capacity from growth, seasonality, and usage drivers.',
  category: 'DevOps',
  icon: 'Gauge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'metrics',
      label: 'Usage metrics',
      type: 'textarea',
      placeholder: 'Provide traffic, utilization, growth, and peaks...',
      required: true,
    },
    {
      id: 'architecture',
      label: 'Architecture',
      type: 'textarea',
      placeholder: 'Describe services, dependencies, and scaling limits...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, quotas, and lead times...',
      required: false,
    },
  ],
  systemPrompt: `You are a capacity planning engineer.

Build a capacity plan for the provided system and demand forecast, including headroom and trigger points.

Output format:

## Demand Drivers
- Traffic, growth, and seasonality.\n- Customer behavior and campaigns.\n- Data volume and retention.

## Current Capacity
- Compute, storage, network, and limits.\n- Bottlenecks and utilization.\n- Vendor quotas and lead times.

## Forecast and Headroom
- Base, high, and stress scenarios.\n- Safety buffers and failure domains.\n- Scaling strategy and cost.

## Triggers and Actions
- Thresholds and lead times.\n- Owners and procurement steps.\n- Review cadence.

Rules:
- Use ranges and scenarios rather than a single forecast.
- Include procurement and scaling lead times.
- Separate infrastructure, licensing, and people capacity.`,

  outputType: 'markdown',
}
