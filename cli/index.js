#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const { getProjectInfo } = require('../setup/detect-stack');
const { applyRules } = require('../setup/apply-rules');

const program = new Command();

console.log(chalk.blue(`
 █████╗  ██████╗ ███████╗███╗   ██╗████████╗██╗ ██████╗     █████╗ ██╗    ██████╗ ██╗   ██╗██╗     ███████╗███████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██║██╔════╝    ██╔══██╗██║    ██╔══██╗██║   ██║██║     ██╔════╝╚══███╔╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ██║██║         ███████║██║    ██████╔╝██║   ██║██║     █████╗    ███╔╝ 
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ██║██║         ██╔══██║██║    ██╔══██╗██║   ██║██║     ██╔══╝   ███╔╝  
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ██║╚██████╗    ██║  ██║██║    ██║  ██║╚██████╔╝███████╗███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝    ╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
`));

program
  .name('agentic-ai-rulez')
  .description('AI Coding Standards & Rules for Enterprise Teams')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize AI coding rules in current project')
  .option('-p, --path <path>', 'project path', '.')
  .option('--stack <stack>', 'force specific stack (python-fastapi, dotnet-bff, dotnet-api)')
  .option('--agents', 'enable multi-agent setup')
  .option('--git-hooks', 'setup git hooks')
  .option('--force', 'overwrite existing files')
  .option('-y, --yes', 'skip confirmations')
  .option('--non-interactive', 'disable interactive prompts (CI mode)')
  .action(async (options) => {
    console.log(chalk.yellow('🔍 Detecting project structure...\\n'));
    
    const projectInfo = getProjectInfo(options.path);
    
    if (!projectInfo) {
      console.log(chalk.red('❌ No supported project stack detected.'));
      console.log(chalk.gray('Supported stacks:'));
      console.log(chalk.gray('  • Python FastAPI + React'));
      console.log(chalk.gray('  • .NET BFF + React'));  
      console.log(chalk.gray('  • .NET Web API'));
      process.exit(1);
    }
    
    console.log(chalk.green(`✅ Detected: ${projectInfo.stack}`));
    console.log(chalk.gray(`📁 Project: ${projectInfo.projectName}`));
    console.log(chalk.gray(`📍 Path: ${projectInfo.projectPath}\\n`));
    
    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `Apply AgenticAIRulez to ${projectInfo.projectName}?`,
          default: true
        },
        {
          type: 'confirm',
          name: 'agents',
          message: 'Enable multi-agent setup (Architect/Builder/Reviewer)?',
          default: options.agents || false,
          when: (answers) => answers.proceed
        },
        {
          type: 'confirm', 
          name: 'gitHooks',
          message: 'Setup automated git hooks for quality checks?',
          default: options.gitHooks || false,
          when: (answers) => answers.proceed
        }
      ]);
      
      if (!answers.proceed) {
        console.log(chalk.yellow('Setup cancelled.'));
        process.exit(0);
      }
      
      options.agents = answers.agents;
      options.gitHooks = answers.gitHooks;
    }
    
    const setupOptions = {
      agents: options.agents,
      gitHooks: options.gitHooks,
      force: options.force,
      forceStack: options.stack,
      nonInteractive: options.nonInteractive || options.yes
    };
    
    const success = await applyRules(options.path, setupOptions);
    
    if (success) {
      console.log(chalk.green('\\n🎉 Setup complete!'));
      
      if (options.agents) {
        console.log(chalk.blue('\\n🤖 Multi-Agent Workflow:'));
        console.log(chalk.gray('  1. Create 3 separate AI chat sessions'));
        console.log(chalk.gray('  2. Copy agent contexts from CLAUDE.md'));  
        console.log(chalk.gray('  3. Follow: Architect → Builder → Reviewer'));
      }
      
      console.log(chalk.blue('\\n📖 Next Steps:'));
      console.log(chalk.gray('  • Review and customize CLAUDE.md'));
      console.log(chalk.gray('  • Commit the rules to version control'));
      console.log(chalk.gray('  • Start your first AI-assisted development session'));
      
    } else {
      console.log(chalk.red('\\n❌ Setup failed.'));
      process.exit(1);
    }
  });

program
  .command('detect')
  .description('Detect project stack without applying rules')
  .option('-p, --path <path>', 'project path', '.')
  .action((options) => {
    console.log(chalk.yellow('🔍 Detecting project structure...\\n'));
    
    const projectInfo = getProjectInfo(options.path);
    
    if (projectInfo) {
      console.log(chalk.green('✅ Project detected:'));
      console.log(`   ${chalk.cyan('Name:')} ${projectInfo.projectName}`);
      console.log(`   ${chalk.cyan('Stack:')} ${projectInfo.stack}`);
      console.log(`   ${chalk.cyan('Path:')} ${projectInfo.projectPath}`);
    } else {
      console.log(chalk.red('❌ No supported project stack detected.'));
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Show information about supported stacks')
  .action(() => {
    console.log(chalk.blue('📚 Supported Technology Stacks:\\n'));
    
    console.log(chalk.green('🐍 Python FastAPI + React'));
    console.log(chalk.gray('   • FastAPI backend with async support'));
    console.log(chalk.gray('   • React frontend with TypeScript'));
    console.log(chalk.gray('   • SQLAlchemy ORM + PostgreSQL'));
    console.log(chalk.gray('   • pytest + React Testing Library'));
    console.log('');
    
    console.log(chalk.green('🔷 .NET BFF + React'));
    console.log(chalk.gray('   • .NET 8+ Backend For Frontend pattern'));
    console.log(chalk.gray('   • React frontend with TypeScript'));
    console.log(chalk.gray('   • Entity Framework Core + SQL Server'));
    console.log(chalk.gray('   • xUnit + React Testing Library'));
    console.log('');
    
    console.log(chalk.green('🔷 .NET Web API'));
    console.log(chalk.gray('   • Pure .NET Web API projects'));
    console.log(chalk.gray('   • Clean Architecture pattern'));
    console.log(chalk.gray('   • Entity Framework Core'));
    console.log(chalk.gray('   • xUnit testing framework'));
    console.log('');
    
    console.log(chalk.blue('🤖 Multi-Agent Support:'));
    console.log(chalk.gray('   • Architect: System design & architecture'));
    console.log(chalk.gray('   • Builder: Feature implementation'));
    console.log(chalk.gray('   • Reviewer: Code quality & security'));
  });

program
  .command('validate')
  .description('Validate existing AgenticAIRulez setup')
  .option('-p, --path <path>', 'project path', '.')
  .action((options) => {
    console.log(chalk.yellow('🔍 Validating AgenticAIRulez setup...\\n'));
    
    const projectPath = path.resolve(options.path);
    const fs = require('fs');
    
    const checks = [
      {
        name: 'CLAUDE.md file',
        path: path.join(projectPath, 'CLAUDE.md'),
        required: true
      },
      {
        name: 'Agent contexts directory',
        path: path.join(projectPath, '.agents'),
        required: false
      },
      {
        name: 'Git hooks',
        path: path.join(projectPath, '.git', 'hooks', 'pre-commit'),
        required: false
      }
    ];
    
    let passed = 0;
    let failed = 0;
    
    checks.forEach(check => {
      if (fs.existsSync(check.path)) {
        console.log(chalk.green(`✅ ${check.name}`));
        passed++;
      } else if (check.required) {
        console.log(chalk.red(`❌ ${check.name} (required)`));
        failed++;
      } else {
        console.log(chalk.yellow(`⚠️  ${check.name} (optional)`));
      }
    });
    
    console.log('');
    if (failed > 0) {
      console.log(chalk.red(`❌ Validation failed: ${failed} required checks failed`));
      console.log(chalk.gray('Run "agentic-ai-rulez init" to fix setup issues.'));
      process.exit(1);
    } else {
      console.log(chalk.green(`✅ Validation passed: ${passed} checks successful`));
    }
  });

program.parse();