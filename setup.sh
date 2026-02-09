#!/bin/bash

# AgenticAIRulez Setup Script
# Quick setup for enterprise AI development standards

set -e

echo "🚀 AgenticAIRulez Setup"
echo "======================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed${NC}"
    echo "Please install Node.js 16+ and try again"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js 16+ required, found v$(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Parse command line arguments
STACK=""
PROJECT_PATH="."
ENABLE_AGENTS=false
ENABLE_GIT_HOOKS=false
NON_INTERACTIVE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --stack=*)
            STACK="${1#*=}"
            shift
            ;;
        --path=*)
            PROJECT_PATH="${1#*=}"
            shift
            ;;
        --agents)
            ENABLE_AGENTS=true
            shift
            ;;
        --git-hooks)
            ENABLE_GIT_HOOKS=true
            shift
            ;;
        --non-interactive)
            NON_INTERACTIVE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --stack=STACK         Force specific stack (python-fastapi, dotnet-bff, dotnet-api)"
            echo "  --path=PATH           Target project path (default: current directory)"
            echo "  --agents              Enable multi-agent setup"
            echo "  --git-hooks           Setup automated git hooks"
            echo "  --non-interactive     Disable interactive prompts (for CI/automation)"
            echo "  --help                Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Detect and apply to current directory"
            echo "  $0 --path=./my-project --agents      # Setup with multi-agent support"
            echo "  $0 --stack=python-fastapi --git-hooks # Force stack and enable hooks"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo ""
echo -e "${BLUE}🔍 Detecting project structure...${NC}"

# Run stack detection
if [ -n "$STACK" ]; then
    echo -e "${YELLOW}⚠️  Using forced stack: $STACK${NC}"
else
    DETECTION_OUTPUT=$(node setup/detect-stack.js "$PROJECT_PATH" 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}$DETECTION_OUTPUT${NC}"
    else
        echo -e "${RED}$DETECTION_OUTPUT${NC}"
        echo ""
        echo -e "${YELLOW}💡 Supported stacks:${NC}"
        echo "   • Python FastAPI + React"
        echo "   • .NET BFF + React"  
        echo "   • .NET Web API"
        exit 1
    fi
fi

echo ""

# Build command line arguments for apply-rules
ARGS="$PROJECT_PATH"

if [ "$ENABLE_AGENTS" = true ]; then
    ARGS="$ARGS --agents"
    echo -e "${BLUE}🤖 Multi-agent setup enabled${NC}"
fi

if [ "$ENABLE_GIT_HOOKS" = true ]; then
    ARGS="$ARGS --git-hooks"
    echo -e "${BLUE}🔧 Git hooks will be configured${NC}"
fi

if [ "$NON_INTERACTIVE" = true ]; then
    ARGS="$ARGS --non-interactive"
    echo -e "${BLUE}🤖 Non-interactive mode enabled${NC}"
fi

echo ""
echo -e "${YELLOW}📝 Applying AgenticAIRulez...${NC}"

# Apply the rules
node setup/apply-rules.js $ARGS

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📖 What was installed:${NC}"
    echo "   • CLAUDE.md - AI coding rules for your stack"
    echo "   • Configuration files (ESLint, Prettier, etc.)"
    
    if [ "$ENABLE_AGENTS" = true ]; then
        echo "   • .agents/ - Multi-agent context files"
    fi
    
    if [ "$ENABLE_GIT_HOOKS" = true ]; then
        echo "   • Git hooks for automated quality checks"
    fi
    
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "   1. Review and customize CLAUDE.md for your needs"
    echo "   2. Commit the rules to version control:"
    echo "      git add ."
    echo "      git commit -m \"Add AgenticAIRulez AI development standards\""
    
    if [ "$ENABLE_AGENTS" = true ]; then
        echo "   3. Start multi-agent development:"
        echo "      • Create 3 AI chat sessions (Architect/Builder/Reviewer)"
        echo "      • Copy agent contexts from CLAUDE.md to each session"
        echo "      • Follow the workflow: Architect → Builder → Reviewer"
    else
        echo "   3. Start AI-assisted development with the new rules"
    fi
    
    echo ""
    echo -e "${YELLOW}📚 Documentation:${NC}"
    echo "   • README.md - Overview and quick start"
    echo "   • docs/REFERENCES.md - Research sources and best practices"
    echo "   • agents/AGENT_ROLES.md - Multi-agent workflow details"
    
else
    echo ""
    echo -e "${RED}❌ Setup failed${NC}"
    echo "Check the output above for error details"
    exit 1
fi