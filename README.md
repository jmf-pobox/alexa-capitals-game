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
  /.github         # GitHub workflows
    /workflows     # CI/CD configuration
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

Deploy to AWS Lambda using the ASK CLI:

```
npm run deploy
```

## Testing with Voice

Once deployed, you can test by saying:
- "Alexa, open US Capitals"
- "What is the capital of California?"
- "Quiz me"
- "The capital is Sacramento"

## Code Quality

This project follows modern JavaScript best practices:
- ESLint v9 for code linting
- Updated dependencies with no deprecation warnings
- Comprehensive test coverage
- Clean separation of concerns

## Project Maintenance

See `TODO.md` for the list of completed tasks and future improvements.