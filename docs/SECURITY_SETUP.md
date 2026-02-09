# Security Setup Guide 🛡️

**OWASP-compliant security tools and configurations for AgenticAIRulez projects.**

## 🎯 Overview

AgenticAIRulez implements enterprise-grade security with:
- **OWASP Top 10** compliance checking
- **Automated vulnerability scanning** in git hooks
- **Security-focused ESLint rules** for frontend
- **Dependency vulnerability checks** for all packages

## 🔧 Security Tools Installation

### **Python FastAPI Projects**

```bash
# Install security tools
pip install bandit[toml] safety semgrep

# Or install all dev dependencies
pip install -e ".[dev]"

# Verify installation
bandit --version
safety --version
semgrep --version
```

### **.NET Projects**

```bash
# Install security analyzers (added to Directory.Build.props)
dotnet add package Microsoft.CodeAnalysis.NetAnalyzers
dotnet add package SonarAnalyzer.CSharp

# Install global security tools
dotnet tool install --global security-scan
dotnet tool install --global dotnet-outdated-tool

# Verify installation
dotnet security-scan --version
dotnet outdated --version
```

### **Frontend (React) Security**

```bash
# Install ESLint security plugins
npm install --save-dev eslint-plugin-security
npm install --save-dev @typescript-eslint/eslint-plugin

# Install npm audit tools
npm install --save-dev npm-audit-html
npm install --save-dev audit-ci

# Verify installation
npm run lint # Should include security rules
npm audit     # Check for vulnerabilities
```

## 🛡️ Security Checks in Git Hooks

### **Pre-commit Security Gates**

Each git commit triggers these security checks:

#### **1. Secret Detection**
```bash
# Scans for hardcoded passwords, API keys, tokens
grep -r --include="*.py" --include="*.js" -E "(password|secret|key|token).*=.*['\"][^'\"]{8,}" .
```

#### **2. Python Security (Bandit)**
```bash
# OWASP Python security linting
bandit -r . -f json -o bandit-report.json
```

#### **3. Dependency Vulnerabilities**
```bash
# Python: Check for known vulnerable packages
safety check

# JavaScript: Check npm packages
npm audit --audit-level=moderate
```

#### **4. Frontend Security (ESLint)**
```bash
# Security-focused linting rules
npm run lint # Includes eslint-plugin-security
```

## 🔍 OWASP Top 10 Compliance

### **A01: Broken Access Control**
- ✅ JWT validation in all API endpoints
- ✅ Role-based authorization checks
- ✅ [Authorize] attributes on controllers

### **A02: Cryptographic Failures**
- ✅ No hardcoded secrets (git hook check)
- ✅ Proper password hashing (bcrypt/Identity)
- ✅ HTTPS enforcement

### **A03: Injection**
- ✅ SQLAlchemy ORM (Python) / EF Core (.NET)
- ✅ Parameterized queries only
- ✅ Input validation with Pydantic/Data Annotations

### **A04: Insecure Design**
- ✅ Security by design in ARCHITECT agent
- ✅ Threat modeling documentation
- ✅ Security review in REVIEWER agent

### **A05: Security Misconfiguration**
- ✅ CORS properly configured
- ✅ No debug mode in production
- ✅ Security headers (HSTS, CSP)

### **A06: Vulnerable and Outdated Components**
- ✅ Automated dependency scanning
- ✅ Regular security updates
- ✅ Package vulnerability alerts

### **A07: Identification and Authentication Failures**
- ✅ Strong password policies
- ✅ JWT with short expiration
- ✅ Multi-factor authentication support

### **A08: Software and Data Integrity Failures**
- ✅ Package integrity verification
- ✅ Secure CI/CD pipeline
- ✅ Code signing where applicable

### **A09: Security Logging and Monitoring Failures**
- ✅ Security events logged
- ✅ No sensitive data in logs
- ✅ Structured logging (Serilog)

### **A10: Server-Side Request Forgery (SSRF)**
- ✅ External URL validation
- ✅ Whitelist approach for external services
- ✅ Proper HttpClient configuration

## 🚨 Critical Security Rules

### **Python FastAPI**
```python
# ❌ NEVER do this
password = "hardcoded123"  # Fails git hook
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")  # SQL injection

# ✅ DO this instead
password = os.getenv("PASSWORD")  # Environment variable
user = db.query(User).filter(User.id == user_id).first()  # ORM
```

### **.NET**
```csharp
// ❌ NEVER do this
public string ConnectionString = "Server=...;Password=secret123;";  // Hardcoded
public IActionResult GetUser(string sql) { 
    return SqlQuery(sql);  // SQL injection
}

// ✅ DO this instead
private readonly IConfiguration _config;
[Authorize]
public async Task<User> GetUser(Guid id) {
    return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);  // EF Core
}
```

### **React Frontend**
```typescript
// ❌ NEVER do this
localStorage.setItem('token', 'hardcoded-jwt');  // Insecure storage
document.innerHTML = userInput;  // XSS vulnerability

// ✅ DO this instead
// Use secure HTTP-only cookies for auth
const sanitizedHtml = DOMPurify.sanitize(userInput);  // XSS protection
```

## 📊 Security Monitoring

### **Continuous Security Scanning**
```bash
# Run full security audit
./scripts/security-audit.sh

# Generate security report
npm run security:report

# Check for outdated packages
./scripts/update-security.sh
```

### **Security Metrics**
- **Vulnerability count**: Track over time
- **Secret detection**: Zero tolerance policy
- **Dependency age**: Keep packages updated
- **Test coverage**: Include security tests

## 🛠️ Troubleshooting

### **Common Issues**

#### **"Bandit not found"**
```bash
pip install bandit[toml]
# Or install via dev dependencies
pip install -e ".[dev]"
```

#### **"ESLint security plugin missing"**
```bash
npm install --save-dev eslint-plugin-security
# Add to .eslintrc.js extends array
```

#### **"Pre-commit hook fails"**
```bash
# Check which security check failed
git status  # See detailed error
./scripts/fix-security-issues.sh  # Auto-fix common issues
```

#### **"False positive security alerts"**
```bash
# Add to bandit config (.bandit)
[bandit]
exclude_dirs = tests,migrations
skips = B101,B601  # Skip specific rules if needed
```

## 🎯 Best Practices

1. **Run security scans locally** before committing
2. **Review all security warnings** - don't skip them
3. **Keep dependencies updated** regularly  
4. **Use environment variables** for all secrets
5. **Enable all security analyzers** in your IDE
6. **Document security decisions** in code comments
7. **Regular security training** for the team

---

**Security is everyone's responsibility!** 🛡️

These tools and practices help ensure your AgenticAIRulez projects meet enterprise security standards and OWASP compliance.