# US Capitals Alexa Skill

A simple Amazon Alexa Skill that quizzes you on the US state capitals.

## Project Structure

This project follows the latest Alexa Skills Kit (ASK) SDK v2 structure:

```
/
  /lambda          # Lambda function code
    /src           # Source code
      /handlers    # Intent handlers
      /utils       # Utility functions
    index.js       # Lambda entry point
  /models          # Interaction model files
    en-US.json     # US English language model
  /test            # Test files
    /unit          # Unit tests
    /integration   # Integration test templates
  /assets          # Skill assets (icons, etc.)
  /infrastructure  # AWS CloudFormation templates
  /.github         # GitHub workflows
    /workflows     # CI/CD configuration
  ask-resources.json # ASK CLI deployment configuration
  skill.json       # Skill manifest (metadata, endpoint config)
  CLAUDE.md        # Guidance for Claude Code AI
  TODO.md          # Project task list
```

## Development Setup

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Run tests**:
   ```
   npm test
   ```
   
   Run a specific test:
   ```
   npm test -- -g "test name pattern"
   ```

3. **Run linting**:
   ```
   npm run lint
   ```

## Features

- **Quiz Mode**: Alexa asks the user to name state capitals
- **Information Mode**: Users can ask for specific state capitals
- **Score Tracking**: Keeps track of user score during quiz sessions
- **Multiple Intent Handlers**: Organized code with separate handlers for each intent

## Testing

### Unit Tests
The project has comprehensive unit tests for:
- All intent handlers (Launch, Answer, Ask, Response, Help, Quit, Cancel/Stop, SessionEnd)
- Utility functions for state capitals
- Response formatting

### Integration Tests
Integration test templates are provided to demonstrate how to:
- Test full conversation flows
- Simulate user interactions
- Verify complete skill behavior

## Local Development

You can test the skill locally using the ASK CLI and local debugging:

1. **Install the ASK CLI**:
   ```
   npm install -g ask-cli
   ```

2. **Initialize ASK CLI**:
   ```
   ask init
   ```

3. **Start local debugging**:
   ```
   ask dialog --locale en-US
   ```

## Continuous Integration

This project uses GitHub Actions for continuous integration:
- Automated testing on Node.js versions 16, 18, and 20
- Code linting
- Test execution

## Deployment

### Prerequisites

1. **Install ASK CLI**:
   ```
   npm install -g ask-cli
   ```

2. **Configure ASK CLI**:
   ```
   ask configure
   ```
   This will guide you through linking your Amazon Developer account.

3. **AWS Permissions**:
   Ensure your AWS user has these permissions:
   - S3FullAccess (or more specific S3 permissions)
   - CloudFormationFullAccess
   - IAMFullAccess
   - LambdaFullAccess

### Deploy the Skill

You can deploy the entire skill (interaction model, Lambda function, and metadata) with:

```
npm run deploy
```

Or deploy specific parts:

```
# Deploy only the interaction model
ask deploy --target skill-metadata

# Deploy only the Lambda function
ask deploy --target skill-infrastructure
```

### Deployment Files

- **ask-resources.json**: Configures deployment settings
- **skill.json**: Defines skill metadata, permissions, and endpoints
- **infrastructure/cfn-deployer/skill-stack.yaml**: AWS CloudFormation template for Lambda setup

### Publishing

After deployment, use the Alexa Developer Console to:
1. Test your skill in the Test tab
2. Complete certification requirements in the Distribution tab
3. Submit for certification

## Testing with Voice

Once deployed, you can test by saying:
- "Alexa, open US Capitals"
- "What is the capital of California?"
- "Quiz me"
- "The capital is Sacramento"

## Code Quality

This project follows modern JavaScript best practices:
- ESLint for code linting
- Updated dependencies with no deprecation warnings
- Comprehensive test coverage
- Clean separation of concerns
- Modular architecture using ASK SDK v2

## Development Notes

The project has been migrated from a monolithic structure to a modular ASK SDK v2 architecture:
- Individual intent handlers in separate files
- Modern Lambda function patterns
- AWS CloudFormation deployment templates
- ASK CLI deployment configuration

## Project Maintenance

See `TODO.md` for the list of completed tasks and future improvements.