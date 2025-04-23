# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Amazon Alexa Skill for quizzing users on US state capitals, built with the ASK SDK v2.

## Development Commands
- Install dependencies: `npm install`
- Run tests: `npm test`
- Run single test: `npm test -- -g "test name pattern"`
- Run linting: `npm run lint`
- Local debug: `ask dialog --locale en-US`
- Deploy: `npm run deploy`

## Code Style Guidelines
- Indentation: 4 spaces
- Strings: Single quotes for strings
- Function style: Use ES6 arrow functions when appropriate
- Module pattern: CommonJS with 'use strict'
- Documentation: JSDoc-style comments for functions
- Error handling: Try/catch for Lambda handlers
- Naming: camelCase for variables/functions
- Line length: Keep under 100 characters
- Code organization: Handlers in separate files
- Session management: Use attributesManager for state

## Testing Guidelines
- Unit tests: Cover all handlers and utilities
- Use sinon for mocking and spying
- Descriptive test names that explain what's being tested
- Integration tests: Verify full conversation flows
- Test both happy paths and error scenarios
- Check session state transitions
- Verify speech responses include expected text

## Project Structure
- Lambda handlers in lambda/src/handlers/
- Utilities in lambda/src/utils/
- Unit tests in test/unit/
- Integration tests in test/integration/
- Interaction model in models/
- CI/CD configuration in .github/workflows/
- Asset files in assets/
- AWS CloudFormation templates in infrastructure/cfn-deployer/

## Deployment
- ASK CLI configuration in ask-resources.json
- Skill manifest in skill.json
- AWS Lambda code in lambda/ directory
- Run `ask deploy` to deploy all components
- Run `ask deploy --target skill-metadata` for just the interaction model
- Run `ask deploy --target skill-infrastructure` for just the Lambda function