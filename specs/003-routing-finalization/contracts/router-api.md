# Router API Contract

## Router Class Interface

### Constructor
```javascript
new Router(routeDiscoveryPath: string = './pages')
```
**Parameters**:
- `routeDiscoveryPath`: Base path for auto-discovering routes

**Returns**: Router instance
**Side Effects**: Initializes route discovery, sets up navigation listeners

### Methods

#### `navigateTo(path: string): Promise<void>`
**Purpose**: Navigate to specified route
**Parameters**:
- `path`: Target route path (e.g., '/home', '/projects')

**Returns**: Promise that resolves when navigation complete
**Side Effects**: 
- Deactivates current component
- Loads and activates target component
- Updates browser history
- Injects HTML content and CSS

**Error Conditions**:
- Route not found: Navigate to 404 page
- Component load failure: Display error state
- HTML parsing failure: Fallback to server-side route

#### `getCurrentRoute(): string | null`
**Purpose**: Get currently active route path
**Returns**: Current route path or null if none active

#### `destroy(): void`
**Purpose**: Clean up router and all cached components
**Side Effects**: Destroys all cached components, removes event listeners

## Component Lifecycle Interface

### BaseComponent Class

#### `activate(): void`
**Purpose**: Activate component when becoming visible
**Side Effects**: Attaches event listeners, initializes UI state
**Preconditions**: Component must be constructed
**Postconditions**: Component is ready for user interaction

#### `deactivate(): void`
**Purpose**: Deactivate component when becoming hidden
**Side Effects**: Removes event listeners, preserves state
**Postconditions**: Component state preserved but not interactive

#### `destroy(): void`
**Purpose**: Permanently destroy component
**Side Effects**: Complete cleanup, removes all references
**Postconditions**: Component cannot be reused

## Route Discovery Contract

### Auto-Discovery Pattern
```javascript
// Input: File system structure
src/pages/
├── home/
│   ├── home.html
│   ├── home.js (exports default class extending BaseComponent)
│   └── home.css
└── projects/
    ├── projects.html
    ├── projects.js
    └── projects.css

// Output: Route configuration
[
  {
    path: '/home',
    component: Home,
    htmlPath: './pages/home/home.html',
    cssPath: './pages/home/home.css'
  },
  {
    path: '/projects', 
    component: Projects,
    htmlPath: './pages/projects/projects.html',
    cssPath: './pages/projects/projects.css'
  }
]
```

## HTML Fragment Contract

### Input: Complete HTML Page
```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
  <link rel="stylesheet" href="./page.css">
</head>
<body>
  <header>Navigation</header>
  <main id="content">
    <h1>Page Content</h1>
    <p>This is the content to extract</p>
  </main>
</body>
</html>
```

### Output: Content Fragment
```html
<h1>Page Content</h1>
<p>This is the content to extract</p>
```

**Extraction Rule**: Content within `<main>` element or fallback to `<body>` content

## Component Cache Contract

### Cache Interface
```javascript
interface ComponentCache {
  get(path: string): Component | null
  set(path: string, component: Component): void
  has(path: string): boolean
  delete(path: string): boolean
  clear(): void
  size: number
}
```

### Cache Policies
- **Retention**: Components retained until explicitly destroyed or cache cleared
- **Activation State**: Cached components stored in deactivated state
- **Memory Management**: Cache size monitored, LRU eviction if needed
- **Cleanup**: All components destroyed when router destroyed

## Error Handling Contract

### Navigation Errors
- **Route Not Found**: Navigate to '/404' route
- **Component Load Failure**: Display error message, maintain current route
- **HTML Parse Failure**: Fallback to server-side navigation
- **CSS Load Failure**: Continue without styles, log warning

### Component Errors
- **Activation Failure**: Log error, deactivate component
- **Event Handler Errors**: Log error, continue operation
- **Memory Leaks**: Monitor and warn about unremoved listeners