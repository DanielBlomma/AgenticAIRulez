#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getProjectInfo } = require('./detect-stack');

/**
 * Apply AI coding rules to a project based on detected stack
 */

function applyRules(projectPath = '.', options = {}) {
  console.log('🚀 Applying AgenticAIRulez...\n');
  
  const projectInfo = getProjectInfo(projectPath);
  
  if (!projectInfo) {
    console.error('❌ Cannot detect project stack. Please check the project structure.');
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
    
    // 5. Stack-specific setup
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
# AgenticAIRulez pre-commit hook
echo "Running pre-commit checks..."

# Python formatting and linting
black . --check || exit 1
isort . --check-only || exit 1
flake8 . || exit 1

# Python tests
python -m pytest || exit 1

# Frontend checks (if package.json exists)
if [ -f "package.json" ] || [ -f "frontend/package.json" ]; then
    npm run lint || exit 1
    npm test -- --watchAll=false || exit 1
fi

echo "✅ Pre-commit checks passed"
`;
  } else if (stack.startsWith('dotnet')) {
    preCommitContent = `#!/bin/sh
# AgenticAIRulez pre-commit hook
echo "Running pre-commit checks..."

# .NET formatting and build
dotnet format --verify-no-changes || exit 1
dotnet build || exit 1

# .NET tests
dotnet test || exit 1

# Frontend checks (if package.json exists)
if [ -f "package.json" ] || find . -name "package.json" -not -path "*/node_modules/*" | grep -q .; then
    npm run lint || exit 1
    npm test -- --watchAll=false || exit 1
fi

echo "✅ Pre-commit checks passed"
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

module.exports = {
  applyRules,
  setupGitHooks,
  createAgentContexts
};