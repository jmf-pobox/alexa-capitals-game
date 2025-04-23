# TODO List

## ✅ Completed Tasks

### Dependency Improvements
- [x] Update deprecated ESLint dependencies:
  - [x] Replace `@humanwhocodes/config-array@0.13.0` with `@eslint/config-array`
  - [x] Replace `@humanwhocodes/object-schema@2.0.3` with `@eslint/object-schema` 
  - [x] Update `eslint@8.57.1` to latest supported version (v9.25.1)

- [x] Update other deprecated dependencies:
  - [x] Fix `inflight@1.0.6` memory leak via override to `@isaacs/inflight@2.0.1`
  - [x] Address `rimraf@3.0.2` deprecation via override to `rimraf@5.0.5`
  - [x] Address `glob@7.2.3` and `glob@8.1.0` deprecation via override to `glob@10.3.10`
  - [x] Handle `lodash.get@4.4.2` (not used in our code, part of sinon dependency tree)
  - [x] Replace `querystring@0.2.0` with `querystringify@2.2.0` via npm overrides
  - [x] Update `sinon@15.2.0` to v16.1.1

### Code Quality Improvements
- [x] Refine unit tests to ensure full coverage of all handlers
- [x] Implement integration test templates with documentation
- [x] Add GitHub Actions workflow for CI/CD
- [x] Update ESLint to version 9 with new configuration format
- [x] Organize code with separate handlers in individual files
- [x] Extract utilities to separate modules for better maintainability

## 🔄 Future Improvements

### Feature Enhancements
- [ ] Add persistence adapter to save user progress between sessions
- [ ] Implement difficulty levels for the quiz
- [ ] Add hint functionality for capital guessing
- [ ] Support for additional locales (beyond en-US)

### Development Experience
- [ ] Set up automated deployment pipeline through GitHub Actions
- [ ] Implement full VirtualAlexa integration tests
- [ ] Add code coverage reporting
- [ ] Create development guide documentation

### Performance Optimizations
- [ ] Optimize response generation for faster replies
- [ ] Improve error handling with better recovery strategies
- [ ] Add telemetry for monitoring skill usage

## Dependency Notes
- Several deprecated packages were transitive dependencies addressed with npm overrides
- Using the latest ESLint v9 with modern configuration format
- All direct dependencies are up-to-date with no deprecation warnings