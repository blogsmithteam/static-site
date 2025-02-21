# Environment Setup Notes

## Homebrew Path Setup
```bash
echo 'eval "$(brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

## NPM Installation Best Practices
Most of the time, you want local installations for npm packages, unless it's a command-line tool you'll use across multiple projects.

# Commands

## Things that PERSIST in your current session:

### Variables
export MY_VAR="hello"
echo $MY_VAR         # Prints "hello"
cd ~/documents       # Change directories
echo $MY_VAR         # Still prints "hello"!

### Directory location
pwd                  # Shows current directory
ls                   # Lists files in current directory
pwd                  # Still in the same place!

### Aliases you create
alias ll='ls -la'    # Create shortcut
ll                   # Works throughout your session


## Things that DON'T persist (lost when terminal closes):

### Regular (non-export) variables
MY_TEMP="temporary"
echo $MY_TEMP        # Works now
### Close terminal and open new one
echo $MY_TEMP        # Empty/undefined

### Directory location
cd ~/documents
### Close terminal and open new one
pwd                  # Back to home directory

#### Temporary aliases
alias ll='ls -la'
# Close terminal and open new one
ll                   # Command not found

## To make things PERMANENT across sessions:

# Add to ~/.zshrc to make them persist
export PERMANENT_VAR="always here"
alias ll='ls -la'

## Common Library Installation Instructions

### Node.js Installation
```bash
# Using Homebrew (recommended for Mac)
brew install node

# Verify installation
node --version
npm --version
```

### Python Installation
```bash
# Using Homebrew (recommended for Mac)
brew install python

# Verify installation
python3 --version
pip3 --version
```

### Ruby Installation
```bash
# Using Homebrew (recommended for Mac)
brew install ruby

# Verify installation
ruby --version
gem --version
```

### Java Installation
```bash
# Using Homebrew (recommended for Mac)
brew install java

# After installation, follow the instructions in terminal to link Java
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk

# Verify installation
java --version
javac --version
```

### Evaluating Node Packages
When choosing libraries, check:

1. **NPM Stats**
   - Weekly downloads
   - Last update
   - Dependencies count
   - GitHub stars

2. **Research Tools**
   - [npmjs.com](https://www.npmjs.com/) - Official registry
   - [npmtrends.com](https://www.npmtrends.com/) - Compare packages
   - [bundlephobia.com](https://bundlephobia.com/) - Check sizes
   - [snyk.io](https://snyk.io/) - Security scanning

3. **Security Maintenance**
```bash
# Fix security issues
npm audit fix
# For major version updates
npm audit fix --force
```

### Current Project Dependencies
- `marked`: Markdown to HTML parser
- `front-matter`: YAML front matter parser
- `fs-extra`: Enhanced file system methods

### Popular Node.js Libraries Overview

1. **Express.js**
   - Web application framework
   - Handles routing, middleware, HTTP requests
   - Essential for backend development

2. **React**
   - UI library for building interfaces
   - Component-based architecture
   - Maintained by Meta (Facebook)

3. **Lodash**
   - Utility library for data manipulation
   - Array, object, and string helpers
   - Performance optimized

4. **Axios**
   - HTTP client for browser/Node.js
   - Promise-based requests
   - Better error handling than fetch

5. **Mongoose**
   - MongoDB object modeling
   - Schema-based solution
   - Built-in validation

6. **Jest**
   - Testing framework
   - Zero configuration needed
   - Built-in code coverage

7. **Socket.io**
   - Real-time bidirectional communication
   - WebSocket with fallbacks
   - Event-driven architecture

8. **Moment.js** (Note: Consider Day.js for new projects)
   - Date manipulation
   - Parse, validate, format dates
   - Timezone handling

9. **TypeScript**
   - JavaScript superset
   - Static typing
   - Enhanced IDE support

10. **Next.js**
    - React framework
    - Server-side rendering
    - File-based routing

### Node Package Installation Types

1. **Local Installation** (default)
```bash
npm install package-name
```
- Installs in project's `node_modules/`
- Listed in project's `package.json`
- Only available in this project
- Best for project dependencies

2. **Global Installation** (`-g` flag)
```bash
npm install -g package-name
```
- Installs system-wide
- Available as commands anywhere in terminal
- Better for command-line tools used across projects
- Example: `npm install -g serve`

3. **Temporary Execution** (`npx`)
```bash
npx package-name
```
- Downloads and runs package temporarily
- Always uses latest version
- Doesn't install permanently
- Good for trying packages or occasional use
- Example: `npx serve public`