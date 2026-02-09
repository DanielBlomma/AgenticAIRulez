#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getProjectInfo } = require('./detect-stack');

/**
 * Apply AI coding rules to a project based on detected stack
 */

async function applyRules(projectPath = '.', options = {}) {
  console.log('🚀 Applying AgenticAIRulez...\n');
  
  let projectInfo = getProjectInfo(projectPath);
  
  // Handle greenfield projects
  if (projectInfo && projectInfo.stack === 'greenfield') {
    if (!options.forceStack) {
      console.log('🆕 Greenfield project detected!');
      
      // Interactive stack selection
      if (!options.nonInteractive) {
        const inquirer = require('inquirer');
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'stack',
            message: 'Which stack would you like to use?',
            choices: [
              { name: '🐍 Python FastAPI + React (AI development)', value: 'python-fastapi' },
              { name: '🔷 .NET BFF + React (Enterprise)', value: 'dotnet-bff' },
              { name: '🔷 .NET Web API (Pure API)', value: 'dotnet-api' }
            ]
          }
        ]);
        projectInfo.stack = answer.stack;
        console.log(`🎯 Selected stack: ${answer.stack}`);
      } else {
        console.error('Please specify stack with --stack flag:');
        console.error('  --stack=python-fastapi   (FastAPI + React)');
        console.error('  --stack=dotnet-bff       (.NET BFF + React)');
        console.error('  --stack=dotnet-api       (.NET Web API)');
        return false;
      }
    } else {
      // Override stack for greenfield
      projectInfo.stack = options.forceStack;
      console.log(`🎯 Using specified stack: ${options.forceStack}`);
    }
  } else if (options.forceStack) {
    // Manual stack override for any project
    if (!projectInfo) {
      projectInfo = {
        stack: options.forceStack,
        projectName: 'MyProject',
        projectPath: path.resolve(projectPath)
      };
    } else {
      projectInfo.stack = options.forceStack;
    }
    console.log(`🎯 Forcing stack override: ${options.forceStack}`);
  }
  
  if (!projectInfo) {
    console.error('❌ Cannot detect project stack. Use --stack flag to specify.');
    return false;
  }
  
  const { stack, projectName } = projectInfo;
  const rulesPath = path.join(__dirname, '../stacks', stack);
  
  if (!fs.existsSync(rulesPath)) {
    console.error(`❌ Rules for stack "${stack}" not found at: ${rulesPath}`);
    return false;
  }
  
  console.log(`📁 Project: ${projectName}`);
  console.log(`🏗️  Stack: ${stack}`);
  console.log(`📍 Path: ${projectInfo.projectPath}\n`);
  
  // Apply stack-specific rules
  const success = applyStackRules(projectInfo, rulesPath, options);
  
  if (success) {
    console.log('\n✅ AgenticAIRulez applied successfully!');
    console.log('\n📖 Next steps:');
    console.log('   1. Review the generated CLAUDE.md file');
    console.log('   2. Customize agent contexts for your specific needs');
    console.log('   3. Run your first multi-agent development session');
    console.log('   4. Commit the rules to version control');
    
    if (options.agents) {
      console.log('\n🤖 Multi-agent setup enabled:');
      console.log('   - Create 3 separate chat sessions for Architect, Builder, and Reviewer');
      console.log('   - Copy the agent contexts from CLAUDE.md to each session');
      console.log('   - Follow the agent workflow: Architect → Builder → Reviewer');
    }
  }
  
  return success;
}

function applyStackRules(projectInfo, rulesPath, options) {
  const { stack, projectName, projectPath } = projectInfo;
  
  try {
    // 1. Copy and customize CLAUDE.md template
    const claudeTemplate = path.join(rulesPath, 'CLAUDE.md.template');
    const claudeTarget = path.join(projectPath, 'CLAUDE.md');
    
    if (fs.existsSync(claudeTemplate)) {
      console.log('📝 Creating CLAUDE.md...');
      let claudeContent = fs.readFileSync(claudeTemplate, 'utf8');
      claudeContent = claudeContent.replace(/{{PROJECT_NAME}}/g, projectName);
      
      fs.writeFileSync(claudeTarget, claudeContent);
      console.log('   ✅ CLAUDE.md created');
    }
    
    // 2. Copy configuration files
    const configFiles = [
      '.eslintrc.js',
      '.prettierrc',
      'pyproject.toml',
      '.editorconfig',
      'Directory.Build.props'
    ];
    
    configFiles.forEach(configFile => {
      const sourcePath = path.join(rulesPath, configFile);
      const targetPath = path.join(projectPath, configFile);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
        console.log(`📄 Creating ${configFile}...`);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`   ✅ ${configFile} created`);
      }
    });
    
    // 3. Setup git hooks if requested
    if (options.gitHooks) {
      setupGitHooks(projectPath, stack);
    }
    
    // 4. Create agent context files if multi-agent enabled
    if (options.agents) {
      createAgentContexts(projectPath, projectName);
    }
    
    // 5. Create greenfield project structure if needed
    if (options.createStructure || isEmptyDirectory(projectPath)) {
      createProjectStructure(projectPath, projectName, stack);
    }
    
    // 6. Stack-specific setup
    if (stack === 'python-fastapi') {
      setupPythonFastAPI(projectPath, projectName);
    } else if (stack === 'dotnet-bff' || stack === 'dotnet-api') {
      setupDotNet(projectPath, projectName, stack);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error applying rules: ${error.message}`);
    return false;
  }
}

function setupGitHooks(projectPath, stack) {
  console.log('🔧 Setting up git hooks...');
  
  const hooksDir = path.join(projectPath, '.git', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    console.log('   ⚠️  No .git directory found, skipping git hooks');
    return;
  }
  
  let preCommitContent = '';
  
  if (stack === 'python-fastapi') {
    preCommitContent = `#!/bin/sh
# AgenticAIRulez pre-commit hook with Security & Quality Gates
echo "🔒 Running security and quality checks..."

# 1. SECURITY CHECKS (HIGHEST PRIORITY)
echo "🛡️  Security scan..."
# Check for hardcoded secrets
if grep -r --include="*.py" --include="*.js" --include="*.json" -E "(password|secret|key|token).*=.*['\"][^'\"]{8,}" . --exclude-dir=node_modules --exclude-dir=.git; then
    echo "❌ SECURITY: Hardcoded secrets detected!"
    exit 1
fi

# Python security linting
if command -v bandit >/dev/null; then
    bandit -r . -f json -o bandit-report.json || {
        echo "❌ SECURITY: Bandit found vulnerabilities"
        exit 1
    }
fi

# Dependency vulnerability check
if command -v safety >/dev/null; then
    safety check || {
        echo "❌ SECURITY: Vulnerable dependencies found"
        exit 1
    }
fi

# 2. PYTHON LINTING & FORMATTING (ESLint equivalent)
echo "🐍 Python code quality..."
black . --check || {
    echo "❌ Python formatting failed. Run: black ."
    exit 1
}
isort . --check-only || {
    echo "❌ Import sorting failed. Run: isort ."
    exit 1
}
flake8 . --max-complexity=10 --max-line-length=100 || {
    echo "❌ Python linting failed"
    exit 1
}

# 3. FRONTEND SECURITY & LINTING
if [ -f "package.json" ] || [ -f "frontend/package.json" ]; then
    echo "⚛️  Frontend security and quality..."
    
    # NPM audit for vulnerable packages
    npm audit --audit-level=moderate || {
        echo "❌ SECURITY: NPM vulnerabilities found. Run: npm audit fix"
        exit 1
    }
    
    # ESLint with security rules
    npm run lint || {
        echo "❌ ESLint failed. Run: npm run lint:fix"
        exit 1
    }
    
    # TypeScript checking
    if [ -f "tsconfig.json" ]; then
        npx tsc --noEmit || {
            echo "❌ TypeScript errors found"
            exit 1
        }
    fi
fi

# 4. TESTS (After security & quality)
echo "🧪 Running tests..."
python -m pytest --tb=short || {
    echo "❌ Python tests failed"
    exit 1
}

if [ -f "package.json" ] || [ -f "frontend/package.json" ]; then
    npm test -- --watchAll=false --coverage=false || {
        echo "❌ Frontend tests failed"
        exit 1
    }
fi

echo "✅ All security and quality checks passed!"
`;
  } else if (stack.startsWith('dotnet')) {
    preCommitContent = `#!/bin/sh
# AgenticAIRulez pre-commit hook with Security & Quality Gates
echo "🔒 Running security and quality checks..."

# 1. SECURITY CHECKS (HIGHEST PRIORITY)
echo "🛡️  Security scan..."
# Check for hardcoded secrets in C# and config files
if grep -r --include="*.cs" --include="*.json" --include="*.xml" -E "(password|secret|key|token).*=.*['\"][^'\"]{8,}" . --exclude-dir=bin --exclude-dir=obj --exclude-dir=node_modules --exclude-dir=.git; then
    echo "❌ SECURITY: Hardcoded secrets detected!"
    exit 1
fi

# .NET security analysis
echo "🔍 .NET security analysis..."
dotnet build --verbosity quiet || {
    echo "❌ Build failed - cannot run security analysis"
    exit 1
}

# Check for security vulnerabilities in NuGet packages
if command -v dotnet >/dev/null; then
    dotnet list package --vulnerable --include-transitive 2>/dev/null | grep -q "has the following vulnerable packages" && {
        echo "❌ SECURITY: Vulnerable NuGet packages found!"
        echo "Run: dotnet list package --vulnerable"
        exit 1
    }
fi

# 2. .NET CODE QUALITY (ESLint equivalent)
echo "🔷 .NET code quality analysis..."

# Code formatting check
dotnet format --verify-no-changes --verbosity quiet || {
    echo "❌ Code formatting failed. Run: dotnet format"
    exit 1
}

# Code analysis (Roslyn analyzers)
dotnet build --configuration Debug --verbosity quiet /p:TreatWarningsAsErrors=true || {
    echo "❌ Code analysis failed. Check warnings and fix."
    exit 1
}

# 3. FRONTEND SECURITY & LINTING (if React project exists)
if [ -f "package.json" ] || find . -name "package.json" -not -path "*/node_modules/*" | grep -q .; then
    echo "⚛️  Frontend security and quality..."
    
    # NPM audit for vulnerable packages
    npm audit --audit-level=moderate || {
        echo "❌ SECURITY: NPM vulnerabilities found. Run: npm audit fix"
        exit 1
    }
    
    # ESLint with security rules
    npm run lint || {
        echo "❌ ESLint failed. Run: npm run lint:fix"  
        exit 1
    }
    
    # TypeScript checking
    if find . -name "tsconfig.json" -not -path "*/node_modules/*" | grep -q .; then
        npx tsc --noEmit || {
            echo "❌ TypeScript errors found"
            exit 1
        }
    fi
fi

# 4. TESTS (After security & quality)
echo "🧪 Running tests..."
dotnet test --configuration Debug --verbosity quiet --no-build || {
    echo "❌ .NET tests failed"
    exit 1
}

if [ -f "package.json" ] || find . -name "package.json" -not -path "*/node_modules/*" | grep -q .; then
    npm test -- --watchAll=false --coverage=false || {
        echo "❌ Frontend tests failed"
        exit 1
    }
fi

echo "✅ All security and quality checks passed!"
`;
  }
  
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(preCommitPath, preCommitContent);
  fs.chmodSync(preCommitPath, 0o755);
  
  console.log('   ✅ Git hooks configured');
}

function createAgentContexts(projectPath, projectName) {
  console.log('🤖 Creating agent context files...');
  
  const agentsDir = path.join(projectPath, '.agents');
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir);
  }
  
  const agents = ['architect', 'builder', 'reviewer'];
  
  agents.forEach(agent => {
    const contextFile = path.join(agentsDir, `${agent}-context.md`);
    const contextContent = `# ${agent.toUpperCase()} Agent Context

## Project: ${projectName}

This file contains the specific context and instructions for the ${agent.toUpperCase()} agent.

Copy the ${agent.toUpperCase()} agent section from CLAUDE.md and paste it here for easy reference during development sessions.

## Usage
1. Open a new chat session for this agent
2. Copy the agent context from CLAUDE.md
3. Paste it at the start of your conversation
4. Begin working within the agent's defined responsibilities

## Agent Handoff
- **Input from:** ${getInputAgent(agent)}
- **Output to:** ${getOutputAgent(agent)}

Remember to follow the agent workflow and maintain clean separation of concerns.
`;
    
    fs.writeFileSync(contextFile, contextContent);
  });
  
  console.log('   ✅ Agent context files created in .agents/ directory');
}

function getInputAgent(agent) {
  switch (agent) {
    case 'architect': return 'Business requirements and project specifications';
    case 'builder': return 'ARCHITECT agent (system design and specifications)';
    case 'reviewer': return 'BUILDER agent (implemented code and features)';
    default: return 'Previous agent in workflow';
  }
}

function getOutputAgent(agent) {
  switch (agent) {
    case 'architect': return 'BUILDER agent';
    case 'builder': return 'REVIEWER agent';  
    case 'reviewer': return 'Final implementation (or back to BUILDER for changes)';
    default: return 'Next agent in workflow';
  }
}

function setupPythonFastAPI(projectPath, projectName) {
  console.log('🐍 Python FastAPI specific setup...');
  
  // Create basic project structure if it doesn't exist
  const dirs = ['backend', 'backend/app', 'backend/app/api', 'backend/app/models', 'backend/app/services', 'backend/tests'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(projectPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`   📁 Created ${dir}/`);
    }
  });
  
  console.log('   ✅ Python FastAPI structure ready');
}

function setupDotNet(projectPath, projectName, stack) {
  console.log('🔷 .NET specific setup...');
  
  // Check if solution already exists
  const solutionFiles = require('glob').sync(path.join(projectPath, '*.sln'));
  
  if (solutionFiles.length === 0) {
    console.log('   ⚠️  No .sln file found. Consider running "dotnet new sln" first.');
  } else {
    console.log(`   ✅ Found solution: ${path.basename(solutionFiles[0])}`);
  }
  
  // Create test directory structure
  const testDir = path.join(projectPath, 'tests');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
    console.log('   📁 Created tests/ directory');
  }
  
  console.log('   ✅ .NET structure ready');
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args.find(arg => !arg.startsWith('--')) || '.';
  
  const options = {
    agents: args.includes('--agents'),
    gitHooks: args.includes('--git-hooks'),
    force: args.includes('--force')
  };
  
  if (args.includes('--help')) {
    console.log(`
AgenticAIRulez Setup Tool

Usage: node apply-rules.js [path] [options]

Options:
  --agents      Enable multi-agent setup with context files
  --git-hooks   Setup git hooks for automated quality checks
  --force       Overwrite existing files
  --help        Show this help message

Examples:
  node apply-rules.js                    # Apply rules to current directory
  node apply-rules.js ./my-project       # Apply rules to specific project
  node apply-rules.js --agents           # Setup with multi-agent contexts
  node apply-rules.js --agents --git-hooks  # Full setup with all features
`);
    process.exit(0);
  }
  
  const success = applyRules(projectPath, options);
  process.exit(success ? 0 : 1);
}

function isEmptyDirectory(projectPath) {
  const files = fs.readdirSync(projectPath).filter(f => !f.startsWith('.'));
  return files.length === 0 || (files.length <= 2 && files.includes('README.md'));
}

function createProjectStructure(projectPath, projectName, stack) {
  console.log('🏗️ Creating greenfield project structure...');
  
  if (stack === 'python-fastapi') {
    createPythonFastAPIStructure(projectPath, projectName);
  } else if (stack === 'dotnet-bff') {
    createDotNetBFFStructure(projectPath, projectName);  
  } else if (stack === 'dotnet-api') {
    createDotNetAPIStructure(projectPath, projectName);
  }
}

function createPythonFastAPIStructure(projectPath, projectName) {
  const structure = {
    'backend/app/__init__.py': '',
    'backend/app/main.py': `from fastapi import FastAPI

app = FastAPI(title="${projectName}", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
`,
    'backend/requirements.txt': `fastapi>=0.104.0
uvicorn[standard]>=0.24.0
sqlalchemy>=2.0.0
pydantic>=2.5.0
`,
    'frontend/package.json': `{
  "name": "${projectName.toLowerCase()}-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "typescript": "^5.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
    'docker-compose.yml': `version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/${projectName.toLowerCase()}
    depends_on:
      - db
      
  frontend:
    build: ./frontend  
    ports:
      - "3000:3000"
    depends_on:
      - backend
      
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=${projectName.toLowerCase()}
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`
  };

  Object.entries(structure).forEach(([filePath, content]) => {
    const fullPath = path.join(projectPath, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    console.log(`   ✅ Created ${filePath}`);
  });
}

function createDotNetBFFStructure(projectPath, projectName) {
  console.log('   🔷 .NET BFF structure creation - run dotnet new commands manually:');
  console.log(`   dotnet new sln -n ${projectName}`);
  console.log(`   dotnet new webapi -n ${projectName}.BFF`);
  console.log(`   dotnet new webapi -n ${projectName}.API`);
  console.log(`   dotnet new react -n ${projectName}.Web`);
  console.log('   dotnet sln add **/*.csproj');
}

function createDotNetAPIStructure(projectPath, projectName) {
  console.log('   🔷 .NET API structure creation - run dotnet new commands manually:');
  console.log(`   dotnet new sln -n ${projectName}`);
  console.log(`   dotnet new webapi -n ${projectName}.API`);
  console.log(`   dotnet new xunit -n ${projectName}.Tests`);
  console.log('   dotnet sln add **/*.csproj');
}

module.exports = {
  applyRules,
  setupGitHooks,
  createAgentContexts,
  isEmptyDirectory,
  createProjectStructure
};