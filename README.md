# AgenticAIRulez 🤖

**AI Coding Standards & Rules for Enterprise Teams**

Centralized, scalable AI development governance for multiple tech stacks with multi-agent workflows.

## 🎯 Quick Start

### **Interactive Setup (Recommended)**
```bash
# Auto-detect existing projects OR interactive stack selection for greenfield
npx @danielblomma/agentic-ai-rulez init

# With multi-agent setup and git hooks
npx @danielblomma/agentic-ai-rulez init --agents --git-hooks
```

### **Manual Stack Selection**
```bash
# Python FastAPI + React (AI development)
npx @danielblomma/agentic-ai-rulez init --stack=python-fastapi --agents

# .NET BFF + React (Enterprise)
npx @danielblomma/agentic-ai-rulez init --stack=dotnet-bff --git-hooks

# .NET Web API (Pure API)
npx @danielblomma/agentic-ai-rulez init --stack=dotnet-api
```

### **CI/Automation Mode**
```bash
# Non-interactive mode for scripts/CI
npx @danielblomma/agentic-ai-rulez init --stack=python-fastapi --non-interactive
```

### **Alternative: Local Setup**
```bash
git clone https://github.com/danielblomma/AgenticAIRulez.git
cd AgenticAIRulez
./setup.sh --stack=python-fastapi --agents --git-hooks
```

## 🏗️ Supported Stacks

| Stack | Description | Greenfield Support | Status |
|-------|-------------|-------------------|---------|
| **python-fastapi** | FastAPI + React + Tests | ✅ Auto-creates structure | ✅ Ready |
| **dotnet-bff** | .NET BFF + React Frontend | ✅ Provides dotnet commands | ✅ Ready |
| **dotnet-api** | Pure .NET Web API + CLI | ✅ Provides dotnet commands | ✅ Ready |

## 🆕 Greenfield Project Support

### **Interactive Stack Selection**
For empty directories, AgenticAIRulez automatically detects greenfield projects and presents an interactive menu:

```
🆕 Greenfield project detected!
? Which stack would you like to use?
❯ 🐍 Python FastAPI + React (AI development)
  🔷 .NET BFF + React (Enterprise)
  🔷 .NET Web API (Pure API)
```

### **Automatic Structure Creation**

#### **Python FastAPI Projects**
Creates complete working structure:
```
my-project/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app with /health endpoint
│   │   └── __init__.py
│   └── requirements.txt         # FastAPI, SQLAlchemy, Pydantic
├── frontend/
│   └── package.json            # React 18, TypeScript, React Query
├── docker-compose.yml          # Full stack with PostgreSQL
├── CLAUDE.md                   # Multi-agent AI rules
└── .agents/                    # Architect/Builder/Reviewer contexts
```

#### **.NET Projects**
Provides exact commands to run:
```bash
# For .NET BFF + React
dotnet new sln -n MyProject
dotnet new webapi -n MyProject.BFF
dotnet new webapi -n MyProject.API
dotnet new react -n MyProject.Web
dotnet sln add **/*.csproj

# Plus: CLAUDE.md, Directory.Build.props, git hooks
```

## ⚙️ Command Line Options

### **Core Commands**
```bash
npx @danielblomma/agentic-ai-rulez init      # Initialize project with AI rules
npx @danielblomma/agentic-ai-rulez detect    # Detect project stack only  
npx @danielblomma/agentic-ai-rulez validate  # Validate existing setup
npx @danielblomma/agentic-ai-rulez info      # Show supported stacks
```

### **Flags & Options**
| Flag | Description | Example |
|------|-------------|---------|
| `--stack <type>` | Force specific stack type | `--stack=python-fastapi` |
| `--agents` | Enable multi-agent contexts | Creates `.agents/` directory |
| `--git-hooks` | Setup automated git hooks | Pre-commit quality checks |
| `--non-interactive` | Skip all prompts (CI mode) | For automation/scripting |
| `--force` | Overwrite existing files | Force update existing setup |
| `-y, --yes` | Skip confirmations | Auto-accept all prompts |
| `-p, --path <dir>` | Target directory | `--path=./my-project` |

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

- **Auto-detection** of existing project stacks
- **Interactive setup** for greenfield projects with beautiful prompts
- **Automatic structure creation** for Python FastAPI projects
- **Stack-specific** CLAUDE.md templates with enterprise patterns
- **Multi-agent** role separation (Architect/Builder/Reviewer)
- **Git hooks** for automated quality gates and code formatting
- **ESLint/Prettier** configurations with team standards
- **Enterprise-grade** compliance tracking and reporting
- **CI/Automation friendly** with non-interactive modes

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