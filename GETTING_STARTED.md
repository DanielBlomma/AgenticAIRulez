# Getting Started with AgenticAIRulez 🚀

**Enterprise-ready AI coding standards for your 22 developers and 100+ applications.**

## 📦 What You Got

A complete, production-ready system for standardizing AI-assisted development across your organization:

### 🎯 **Core Features**
- **Multi-agent workflow** (Architect/Builder/Reviewer)
- **Auto-detection** of your Python FastAPI and .NET stacks
- **Stack-specific CLAUDE.md templates** with enterprise patterns
- **Automated quality gates** via git hooks
- **NPM package** for easy distribution

### 📁 **Repository Structure**
```
AgenticAIRulez/
├── README.md                 # Main documentation
├── package.json             # NPM package configuration
├── setup.sh                 # Quick setup script
├── 
├── stacks/                  # Stack-specific templates
│   ├── python-fastapi/      # Your AI development stack
│   ├── dotnet-bff/         # Your enterprise main stack
│   └── dotnet-api/         # Pure API projects
│
├── agents/                 # Multi-agent definitions
│   └── AGENT_ROLES.md      # Detailed agent workflows
│
├── setup/                  # Automation scripts
│   ├── detect-stack.js     # Auto-detect project type
│   └── apply-rules.js      # Apply rules to projects
│
├── cli/                    # Command-line interface
│   └── index.js           # Main CLI tool
│
└── docs/                   # Documentation & research
    └── REFERENCES.md       # All research sources
```

## 🚀 Quick Start

### Option 1: NPM Package (Recommended)
```bash
# Use in any project directory
npx @danielblomma/agentic-ai-rulez init

# With multi-agent setup
npx @danielblomma/agentic-ai-rulez init --agents --git-hooks
```

### Option 2: Local Setup Script
```bash
# Clone and setup
git clone https://github.com/danielblomma/AgenticAIRulez.git
cd AgenticAIRulez
./setup.sh --agents --git-hooks
```

## 📋 Enterprise Deployment

### 1. **Create Internal NPM Package**
```bash
# Customize for your organization
npm version 1.0.0
npm publish --access=public

# Or publish to internal registry
npm publish --registry=https://your-internal-npm.company.com
```

### 2. **Team Distribution**
```bash
# Each developer runs:
npx @your-company/agentic-ai-rulez init --agents

# Or add to project setup documentation:
echo "npx @your-company/agentic-ai-rulez init" >> YOUR_PROJECT_SETUP.md
```

### 3. **CI/CD Integration**
```yaml
# .github/workflows/ai-standards.yml
name: AI Standards Check
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx @your-company/agentic-ai-rulez validate
```

## 🤖 Multi-Agent Workflow

### **Phase 1: Architecture (30 min)**
1. Create **ARCHITECT** chat session
2. Copy Architect context from `CLAUDE.md`
3. Input: Business requirements
4. Output: System design, API specs, database schema

### **Phase 2: Implementation (2-4 hours)**
1. Create **BUILDER** chat session  
2. Copy Builder context from `CLAUDE.md`
3. Input: Architect's specifications
4. Output: Working code, tests, integrations

### **Phase 3: Quality Review (30 min)**
1. Create **REVIEWER** chat session
2. Copy Reviewer context from `CLAUDE.md`  
3. Input: Builder's implementation
4. Output: Security review, performance optimizations

## 🎯 Stack-Specific Features

### **Python FastAPI + React**
- FastAPI async patterns
- SQLAlchemy 2.0+ best practices
- React Query for state management
- pytest + React Testing Library
- Type hints and Pydantic validation

### **.NET BFF + React**
- Backend For Frontend pattern
- Clean Architecture layers
- Entity Framework Core optimization
- JWT authentication flows
- xUnit + FluentAssertions

### **.NET Web API**
- Pure API architecture
- Minimal API patterns
- Clean Code principles
- Performance optimization
- Enterprise security patterns

## 📊 Compliance Tracking

### **Individual Project**
```bash
# Validate current project
npx @danielblomma/agentic-ai-rulez validate

# Check what stack was detected
npx @danielblomma/agentic-ai-rulez detect
```

### **Organization Dashboard**
Create a simple dashboard to track adoption:

```bash
# Scan all repositories
for repo in $(find /path/to/repos -name ".git" | sed 's/.git//'); do
  echo "Checking $repo"
  cd "$repo"
  npx @danielblomma/agentic-ai-rulez validate --json >> /tmp/ai-standards-report.json
done
```

## 🔧 Customization

### **Adding New Stacks**
1. Create `stacks/your-stack/` directory
2. Add `CLAUDE.md.template` with stack-specific rules
3. Update `setup/detect-stack.js` detection logic
4. Test with sample project

### **Modifying Agent Roles**
1. Edit `agents/AGENT_ROLES.md` 
2. Update stack templates in `stacks/*/CLAUDE.md.template`
3. Test with your team's workflow

### **Company-Specific Rules**
1. Fork the repository
2. Modify templates for your coding standards
3. Update package.json with your organization name
4. Publish to internal NPM registry

## 📈 Measuring Success

### **Developer Productivity Metrics**
- Time from idea to working feature
- Code review cycle time  
- Bug rate post-deployment
- Developer satisfaction surveys

### **Code Quality Metrics**  
- Test coverage percentage
- ESLint/analyzer violations
- Security vulnerability detection
- Performance benchmark compliance

### **Team Adoption Metrics**
- Projects using AgenticAIRulez
- Teams using multi-agent workflow
- Compliance with coding standards
- Training completion rates

## 🆘 Troubleshooting

### **Stack Not Detected**
```bash
# Force stack detection
npx @danielblomma/agentic-ai-rulez init --stack=python-fastapi

# Manual setup
cp stacks/python-fastapi/CLAUDE.md.template ./CLAUDE.md
```

### **Git Hooks Not Working**
```bash
# Re-apply hooks
npx @danielblomma/agentic-ai-rulez init --git-hooks --force

# Manual hook setup
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### **Agent Context Too Long**
- Split large contexts into multiple sessions
- Use `--compact` mode for shorter prompts  
- Focus on one agent role per session

## 🎓 Training Your Team

### **Week 1: Introduction**
- Demo the multi-agent workflow
- Show before/after code quality examples
- Run pilot project with volunteers

### **Week 2: Hands-on Workshop**
- Each team practices with their current project
- Troubleshoot setup issues
- Customize templates for team needs

### **Week 3: Full Adoption**
- All new projects use AgenticAIRulez
- Code reviews check for compliance
- Gather feedback and iterate

## 🚀 Next Steps

1. **Immediate (This Week)**
   - Test on 2-3 pilot projects
   - Train core developers  
   - Customize for your company

2. **Short Term (Month 1)**
   - Roll out to all teams
   - Integrate with CI/CD
   - Create compliance dashboard

3. **Long Term (Quarter 1)**
   - Measure productivity gains
   - Expand to more stacks
   - Share success stories

---

**Questions?** Open an issue on GitHub or reach out to Daniel directly!

**Ready to transform your AI development workflow?** 🚀