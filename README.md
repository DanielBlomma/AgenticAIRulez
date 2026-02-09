# AgenticAIRulez 🤖

**AI Coding Standards & Rules for Enterprise Teams**

Centralized, scalable AI development governance for multiple tech stacks with multi-agent workflows.

## 🎯 Quick Start

```bash
# Auto-detect and apply rules for your project
npx @danielblomma/agentic-ai-rulez

# Or manual setup
git clone https://github.com/danielblomma/AgenticAIRulez.git
cd AgenticAIRulez
./setup.sh --stack=python-fastapi --agents=true
```

## 🏗️ Supported Stacks

| Stack | Description | Status |
|-------|-------------|---------|
| **python-fastapi** | FastAPI + React + Tests | ✅ Ready |
| **dotnet-bff** | .NET BFF + React Frontend | ✅ Ready |
| **dotnet-api** | Pure .NET Web API + CLI | ✅ Ready |

## 🤖 Multi-Agent Architecture

Each project gets 3 specialized AI agents with distinct roles:

### Agent 1: **ARCHITECT** 🏗️
- System design & API planning
- Technology decisions
- Project structure & conventions
- Database modeling

### Agent 2: **BUILDER** 👷
- Feature implementation
- Business logic coding
- Integration work
- "Make it work" focus

### Agent 3: **REVIEWER** 🔍
- Code quality & security
- Performance optimization
- Cross-agent consistency
- Refactoring suggestions

## 📁 Repository Structure

```
AgenticAIRulez/
├── stacks/                    # Stack-specific configurations
│   ├── python-fastapi/        # Python FastAPI + React + Tests
│   ├── dotnet-bff/           # .NET BFF + React Frontend  
│   └── dotnet-api/           # .NET Web API + CLI
├── agents/                   # Agent role definitions
│   ├── architect/            # System design agent
│   ├── builder/             # Implementation agent
│   └── reviewer/            # Quality assurance agent
├── setup/                   # Auto-detection & setup scripts
├── examples/               # Real-world project examples
└── docs/                  # Best practices & references
```

## 🚀 Features

- **Auto-detection** of project stack
- **Stack-specific** CLAUDE.md templates
- **Multi-agent** role separation
- **Git hooks** for automated quality gates
- **ESLint/Prettier** configurations
- **Enterprise-grade** compliance tracking

## 📊 Governance Dashboard

Track AI coding adoption across your organization:
- Compliance per team
- Rule violations & trends  
- Agent usage patterns
- Performance metrics

## 🔗 References & Research

Built on latest AI development research and enterprise best practices. See [References](./docs/REFERENCES.md) for full source list.

---

**Maintained by:** Daniel Blomma  
**For Enterprise Teams:** 22+ developers, 100+ applications  
**License:** MIT