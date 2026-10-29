# Open-Agents

## Overview
Open-Agents is an open-source platform for building and managing AI agent workflows.

## Features
- Modular architecture
- Scalable deployment
- Extensible plugin system
- Built-in monitoring

## Roadmap & Priorities
Looking to see where Open-Agents is heading or where your contributions will have the biggest impact? Check out our [Project Roadmap](ROADMAP.md) for current seasonal priorities, subsystem plans, and help-wanted focus areas.

## Contributing
We welcome contributions! Please see the contributing guidelines below.

### How to Contribute
1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Run `npm run verify` to test and build locally
5. Submit a pull request

### Dependency update policy

Dependabot checks npm dependencies weekly. Patch and minor updates are proposed normally;
major updates are grouped into one `major-dependencies` pull request so maintainers can review
breaking changes together. No package is globally excluded from major-version updates: grouped
pull requests keep the upgrade backlog visible while allowing compatibility work to be planned.

### Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/Open-Agents.git

# Install dependencies
npm install

# Run the local verification (tests and build)
npm run verify

# Start development server
npm run dev
```
