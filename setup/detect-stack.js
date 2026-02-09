#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Auto-detect project stack based on files and patterns
 * Returns stack identifier for template selection
 */

function detectProjectStack(projectPath = '.') {
  console.log(`🔍 Detecting stack in: ${path.resolve(projectPath)}`);
  
  // Check if directory is empty or nearly empty (greenfield)
  const files = fs.readdirSync(projectPath).filter(f => !f.startsWith('.'));
  const isGreenfield = files.length === 0 || (files.length <= 2 && files.includes('README.md'));
  
  if (isGreenfield) {
    console.log('🆕 Greenfield project detected (empty/minimal directory)');
    console.log('💡 Use --stack flag to specify: python-fastapi, dotnet-bff, or dotnet-api');
    console.log('   Example: npx @danielblomma/agentic-ai-rulez init --stack=python-fastapi');
    return 'greenfield';
  }
  
  // Check for Python FastAPI + React
  if (isPythonFastAPI(projectPath)) {
    console.log('✅ Detected: Python FastAPI + React');
    return 'python-fastapi';
  }
  
  // Check for .NET BFF + React
  if (isDotNetBFF(projectPath)) {
    console.log('✅ Detected: .NET BFF + React');
    return 'dotnet-bff';
  }
  
  // Check for pure .NET API
  if (isDotNetAPI(projectPath)) {
    console.log('✅ Detected: .NET Web API');
    return 'dotnet-api';
  }
  
  console.log('❌ No supported stack detected');
  console.log('Supported stacks:');
  console.log('  - Python FastAPI + React');
  console.log('  - .NET BFF + React');
  console.log('  - .NET Web API');
  console.log('💡 For greenfield projects, use --stack flag to specify stack type');
  
  return null;
}

function isPythonFastAPI(projectPath) {
  const checks = [
    // Python environment files
    fs.existsSync(path.join(projectPath, 'requirements.txt')),
    fs.existsSync(path.join(projectPath, 'pyproject.toml')),
    
    // FastAPI indicators
    hasFileContaining(projectPath, ['main.py', 'app.py'], ['fastapi', 'FastAPI']),
    
    // React frontend (optional)
    fs.existsSync(path.join(projectPath, 'frontend/package.json')) ||
    fs.existsSync(path.join(projectPath, 'client/package.json')) ||
    fs.existsSync(path.join(projectPath, 'package.json'))
  ];
  
  // Need Python + FastAPI indicators
  return checks[0] && checks[1];
}

function isDotNetBFF(projectPath) {
  const checks = [
    // .NET solution file
    fs.existsSync(path.join(projectPath, '*.sln')) || 
    glob.sync(path.join(projectPath, '*.sln')).length > 0,
    
    // BFF project pattern
    hasFolderMatching(projectPath, '**/BFF/**') ||
    hasFolderMatching(projectPath, '**/*.BFF/**'),
    
    // React frontend
    hasFileContaining(projectPath, ['package.json'], ['react', 'React']),
    
    // Multiple .NET projects (BFF + API pattern)
    glob.sync(path.join(projectPath, '**/*.csproj')).length >= 2
  ];
  
  return checks[0] && checks[1];
}

function isDotNetAPI(projectPath) {
  const checks = [
    // .NET solution file
    fs.existsSync(path.join(projectPath, '*.sln')) || 
    glob.sync(path.join(projectPath, '*.sln')).length > 0,
    
    // API project indicators
    hasFileContaining(projectPath, ['Program.cs', 'Startup.cs'], ['WebApplication', 'UseRouting']),
    
    // NOT a BFF pattern (no BFF folder)
    !hasFolderMatching(projectPath, '**/BFF/**')
  ];
  
  return checks[0] && checks[1] && checks[2];
}

function hasFileContaining(projectPath, fileNames, searchTerms) {
  for (const fileName of fileNames) {
    try {
      const filePath = path.join(projectPath, fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (searchTerms.some(term => content.includes(term))) {
          return true;
        }
      }
    } catch (error) {
      // File read error, continue checking
      continue;
    }
  }
  return false;
}

function hasFolderMatching(projectPath, pattern) {
  try {
    return glob.sync(path.join(projectPath, pattern)).length > 0;
  } catch (error) {
    return false;
  }
}

function getProjectInfo(projectPath = '.') {
  const stack = detectProjectStack(projectPath);
  
  if (!stack) {
    return null;
  }
  
  // Try to extract project name
  const packageJsonPath = path.join(projectPath, 'package.json');
  const slnFiles = glob.sync(path.join(projectPath, '*.sln'));
  
  let projectName = 'MyProject';
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      projectName = packageJson.name || projectName;
    } catch (error) {
      // Continue with default name
    }
  } else if (slnFiles.length > 0) {
    projectName = path.basename(slnFiles[0], '.sln');
  } else {
    projectName = path.basename(path.resolve(projectPath));
  }
  
  return {
    stack,
    projectName,
    projectPath: path.resolve(projectPath)
  };
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || '.';
  const result = getProjectInfo(projectPath);
  
  if (result) {
    console.log('\n📋 Project Information:');
    console.log(`   Name: ${result.projectName}`);
    console.log(`   Stack: ${result.stack}`);
    console.log(`   Path: ${result.projectPath}`);
    process.exit(0);
  } else {
    console.log('\n❌ Unable to detect supported project stack');
    process.exit(1);
  }
}

module.exports = {
  detectProjectStack,
  getProjectInfo,
  isPythonFastAPI,
  isDotNetBFF,
  isDotNetAPI
};