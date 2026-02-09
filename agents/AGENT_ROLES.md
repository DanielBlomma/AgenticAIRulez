# Multi-Agent Roles & Responsibilities 🤖

**Core Principle:** Separation of concerns prevents context pollution and improves output quality.

## 🏗️ Agent 1: ARCHITECT

### **Primary Role**
System design, architecture decisions, and project foundation.

### **Responsibilities**
- **System Architecture:** Define overall structure, patterns, and approach
- **Technology Stack:** Choose frameworks, libraries, and tools
- **API Design:** Define endpoints, contracts, and data models
- **Database Design:** Schema design, relationships, migrations
- **Project Structure:** Folder organization, naming conventions
- **Security Architecture:** Authentication, authorization, data protection
- **Performance Strategy:** Caching, optimization, scalability planning

### **Context Limitations**
- **Focus:** High-level design, not implementation details
- **Time Horizon:** Long-term architecture, not immediate bugs
- **Scope:** Cross-cutting concerns, not individual features

### **Input Requirements**
```markdown
# For Architect Agent:
- Business requirements (high-level)
- Performance requirements
- Security requirements  
- Integration requirements
- Team size and skill level
- Technology constraints
```

### **Output Deliverables**
- System architecture diagrams
- API specifications (OpenAPI/Swagger)
- Database schema
- Project folder structure
- Technology choices rationale
- Security model documentation

---

## 👷 Agent 2: BUILDER

### **Primary Role**
Feature implementation, business logic, and integration work.

### **Responsibilities**
- **Feature Implementation:** Build according to Architect's specifications
- **Business Logic:** Implement domain rules and workflows
- **API Implementation:** Code the endpoints defined by Architect
- **Database Operations:** Implement queries, migrations, data access
- **Integration Work:** Connect services, external APIs, third-party tools
- **Error Handling:** Implement robust error handling and validation
- **Testing Implementation:** Unit tests, integration tests

### **Context Limitations**
- **Focus:** Implementation details, not architecture changes
- **Scope:** Individual features, not system-wide decisions
- **Dependencies:** Works within Architect's constraints

### **Input Requirements**
```markdown
# For Builder Agent:
- Architecture specifications from Agent 1
- Feature requirements (detailed)
- API contracts and data models
- Existing codebase context
- Test requirements
- Performance targets
```

### **Output Deliverables**
- Working feature code
- Unit and integration tests
- Database migrations
- API endpoint implementations
- Error handling and validation
- Performance optimizations

---

## 🔍 Agent 3: REVIEWER

### **Primary Role**
Code quality, security review, and optimization.

### **Responsibilities**
- **Code Quality:** Review implementation for best practices
- **Security Review:** Identify vulnerabilities and security issues
- **Performance Analysis:** Find bottlenecks and optimization opportunities
- **Consistency Check:** Ensure code follows project conventions
- **Documentation Review:** Verify code is properly documented
- **Test Coverage:** Ensure adequate testing and quality
- **Refactoring Suggestions:** Propose improvements and cleanup

### **Context Limitations**
- **Focus:** Quality and optimization, not new features
- **Scope:** Code review, not system architecture
- **Timing:** Post-implementation review, not design phase

### **Input Requirements**
```markdown
# For Reviewer Agent:
- Completed code from Agent 2
- Architecture guidelines from Agent 1
- Project coding standards
- Security requirements
- Performance benchmarks
- Test coverage requirements
```

### **Output Deliverables**
- Code review feedback
- Security vulnerability reports
- Performance optimization suggestions
- Refactoring recommendations
- Documentation improvements
- Test coverage analysis

---

## 🔄 Agent Interaction Workflow

### **Phase 1: Planning (Architect)**
1. Architect analyzes requirements
2. Creates system design and API specs
3. Defines project structure and conventions
4. Hands off to Builder

### **Phase 2: Implementation (Builder)**
1. Builder receives Architect specifications
2. Implements features according to design
3. Creates tests and handles errors
4. Hands off to Reviewer

### **Phase 3: Quality Assurance (Reviewer)**
1. Reviewer examines Builder's implementation
2. Checks against Architect's guidelines
3. Provides feedback and optimization suggestions
4. Either approves or requests changes

### **Iteration Cycles**
- **Quick feedback loops:** Each phase should be 1-4 hours max
- **Continuous refinement:** Agents can request clarification from each other
- **Version control:** Each agent's work is committed separately

---

## 🎯 Best Practices

### **Context Management**
- **Keep agent contexts focused:** Don't mix architectural decisions with implementation details
- **Use clear handoffs:** Explicit input/output between agents
- **Version control integration:** Each agent commits with role-specific messages

### **Communication Patterns**
```markdown
# Architect → Builder
"Here's the API design and data models. Implement the user authentication flow."

# Builder → Reviewer  
"Implemented user auth with JWT tokens. Please review for security and performance."

# Reviewer → Builder/Architect
"Security issue found: tokens should expire in 15 min, not 24h. Also optimize the password hash function."
```

### **Quality Gates**
- **Architect Gate:** Design must be reviewed before implementation
- **Builder Gate:** Code must compile and pass basic tests
- **Reviewer Gate:** Security and quality standards must be met

---

## 📊 Success Metrics

### **Agent Performance**
- **Architect:** Time to complete design phase, architecture decision quality
- **Builder:** Implementation speed, bug rate, test coverage
- **Reviewer:** Issue detection rate, false positive rate, improvement suggestions

### **Overall Project Health**
- **Cycle Time:** Complete feature delivery (all 3 agents)
- **Quality:** Post-deployment bug rate
- **Consistency:** Code style and architecture adherence
- **Team Satisfaction:** Developer experience with multi-agent workflow