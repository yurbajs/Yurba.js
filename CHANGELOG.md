# Changelog

All notable changes to this project will be documented in this file.

## [0.1.4] - 2024-12-19

### Added
- ✅ **Token validation** - Proper Yurba token format validation (y.xxxxx)
- ✅ **Centralized error system** - Custom error classes for better error handling
- ✅ **Interface-based architecture** - Added interfaces for better code organization
- ✅ **Middleware system** - Advanced middleware management with priorities
- ✅ **Client options** - Constructor now accepts options object (discord.js style)
- ✅ **Improved TypeScript support** - Better typing throughout the codebase
- ✅ **Pre-commit hooks** - Automated linting and formatting
- ✅ **Real CI/CD pipeline** - Proper GitLab CI configuration for monorepo

### Changed
- 🔄 **Client constructor** - Now accepts options object instead of separate parameters
- 🔄 **Middleware handling** - Replaced simple array with proper MiddlewareManager
- 🔄 **Error handling** - All errors now use custom error classes
- 🔄 **Package versions** - Updated @yurbajs/types to 0.1.3

### Fixed
- 🐛 **Removed debug console.log** - Cleaned up production code
- 🐛 **Global variables** - Removed dangerous global declarations
- 🐛 **Type safety** - Improved typing, reduced 'any' usage
- 🐛 **Command parsing** - Better error handling in command argument parsing

### Security
- 🔒 **Token validation** - Prevents invalid tokens from being used
- 🔒 **Input validation** - Better validation of user inputs

## [0.1.3] - Previous Release
- Basic functionality
- REST API client
- WebSocket support
- Command system