# AGENTS.md - Postman Collection Builder

Este archivo contiene directrices para agentes de código que trabajan en este proyecto de construcción de colecciones de Postman con React.

## Project Overview
Postman Collection Builder - Aplicación React para crear y gestionar colecciones de Postman visualmente.

## Tech Stack
- React 18+ con Hooks
- Tailwind CSS para estilos
- JavaScript (ES6+) - No TypeScript
- Postman Collection v2.1.0 schema

## Build, Lint & Test Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm run test

# Run single test file
npm run test -- --testPathPattern=<test-file-name>

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

## Code Style Guidelines

### Imports
- Use ES6 imports/exports
- Group imports in order: React, libraries, internal modules
- Avoid default exports - use named exports
```javascript
import { useState, useEffect } from 'react';
import { emptyCollection, createUseCase } from './domain-logic';
```

### Component Structure
- Functional components only (no class components)
- Use Hooks for state and effects
- Keep components focused and single-responsibility
- Props destructuring at function signature level
```javascript
const RequestHeader = ({ name, method, onUpdate }) => {
  // Component logic
};
```

### State Management
- Use useState for local component state
- Lift state up to App when shared between components
- Selected request ID tracked in App component
- Collection stored in App state
```javascript
const [selectedRequestId, setSelectedRequestId] = useState(null);
const [collection, setCollection] = useState(emptyCollection);
```

### Naming Conventions
- Components: PascalCase (RequestHeader, UseCaseList)
- Functions/Variables: camelCase (createRequest, selectedRequestId)
- Constants: camelCase (emptyCollection, createUseCase)
- Event handlers: handle prefix (handleClick, handleChange)
- Boolean flags: is/has prefix (isOpen, hasError)

### Formatting
- 2 space indentation
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- Max line length: 100 characters
- No semicolons (use Prettier default)

### Error Handling
- Validate inputs in domain-logic functions
- Show user-friendly error messages in UI
- Use try-catch for async operations
- Log errors for debugging
```javascript
const createUseCase = (name) => {
  if (!name || name.trim() === '') {
    throw new Error('Use case name cannot be empty');
  }
  return { name: name.trim(), item: [], protocolProfileBehavior: {} };
};
```

### Tailwind CSS Guidelines
- Use semantic color classes (slate-900, green-500)
- Maintain consistent spacing (p-6, px-2, py-1)
- Use flexbox for layouts
- Responsive-first approach
- No custom CSS files - use Tailwind classes

### File Organization
- `/src/components/` - React components
- `/src/lib/` - Utility functions and domain logic
- `/src/hooks/` - Custom React hooks
- `/src/constants/` - Constants and configurations

### Component Props
- Define prop types with PropTypes
- Default props where appropriate
- Minimal props - use context for deeply nested props
- Callback functions for parent-child communication

## Architecture Patterns

### Domain Logic (domain-logic.js)
- Pure functions for data transformations
- No UI logic in domain layer
- Export named functions, not objects
- Functions should be testable independently

### Sidebar
- Width: ~300px fixed
- Background: slate-900
- Accordion pattern for use cases
- Collapsible request items
- Click to select request

### Main Editor
- Dynamic form based on selected request
- Tabs for Headers, Body, Tests
- Real-time updates to state
- URL bar with query params support

### Data Flow
1. User interacts with UI components
2. Events bubble up to App component
3. State updated in App
4. Props flow down to children
5. Re-render reflects changes

## Testing Guidelines
- Test domain logic functions independently
- Test component rendering and interactions
- Mock external dependencies
- Test error paths
- Maintain good coverage

## Common Patterns

### Adding a New Request
```javascript
const addRequest = (useCaseId, request) => {
  setCollection(prev => {
    const updated = { ...prev };
    const useCase = updated.item.find(uc => uc.name === useCaseId);
    if (useCase) useCase.item.push(request);
    return updated;
  });
};
```

### Updating Request Data
```javascript
const updateRequest = (requestId, updates) => {
  setCollection(prev => {
    // Deep update logic
  });
};
```
