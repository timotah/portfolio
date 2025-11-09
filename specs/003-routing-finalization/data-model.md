# Data Model: Routing Finalization

## Core Entities

### Router
**Purpose**: Manages navigation between routes and component lifecycle
**State**:
- `currentComponent`: Reference to active component instance
- `componentCache`: Map of route paths to cached component instances  
- `routes`: Auto-discovered route configuration
- `isInitialized`: Router initialization status

**Lifecycle**:
- Initialize: Discover routes from file system, setup event listeners
- Navigate: Deactivate current, load/activate target component
- Cleanup: Destroy all cached components on app termination

### Component
**Purpose**: Individual page component with managed lifecycle
**State**:
- `isActive`: Whether component is currently displayed
- `eventListeners`: Array of registered event listeners for cleanup
- `element`: DOM element reference (optional)
- `path`: Component route path

**Lifecycle**:
- Constructor: Setup component state, prepare event handlers
- Activate: Attach event listeners, initialize UI state
- Deactivate: Remove event listeners, preserve state
- Destroy: Complete cleanup, remove all references

### Route
**Purpose**: Configuration for a single application route
**Properties**:
- `path`: URL path (e.g., '/home', '/projects')
- `component`: Component class constructor
- `htmlPath`: Path to HTML template file
- `cssPath`: Path to component CSS file
- `title`: Page title for document.title

**Discovery Pattern**:
```
src/pages/home/ → { path: '/home', component: Home, htmlPath: 'src/pages/home/home.html' }
src/pages/aboutme/ → { path: '/aboutme', component: AboutMe, htmlPath: 'src/pages/aboutme/aboutme.html' }
```

### ComponentCache
**Purpose**: Manages component instance storage and retrieval
**Structure**: Map<string, Component>
**Policies**:
- Key: Route path (e.g., '/home')
- Value: Component instance
- Cleanup: LRU eviction if memory pressure detected
- Activation: Components stored in deactivated state

**Operations**:
- `get(path)`: Retrieve cached component or null
- `set(path, component)`: Store component instance
- `clear()`: Destroy all cached components
- `evict(path)`: Remove and destroy specific component

## State Transitions

### Component Lifecycle
```
Created → Activated → Deactivated → Destroyed
    ↑         ↓           ↑
    └─────────┴───────────┘
       (caching cycle)
```

### Navigation Flow
```
User Click → Router.navigateTo() → Current.deactivate() → 
Target.load() → Target.activate() → Cache.store()
```

## Validation Rules

### Route Discovery
- Each page directory MUST contain {name}.html and {name}.js
- Component class MUST extend BaseComponent
- HTML files MUST be valid and parseable

### Component Lifecycle
- activate() MUST be idempotent (safe to call multiple times)
- destroy() MUST remove ALL event listeners
- Components MUST handle missing DOM elements gracefully

### Cache Management
- Cache size MUST not exceed reasonable memory limits
- Destroyed components MUST be removed from cache
- Cache MUST survive navigation but not page refresh

## Integration Points

### File System Integration
- Route discovery via `import.meta.glob('./pages/**/*.js')`
- HTML template loading via `import.meta.glob('./pages/**/*.html', { query: '?raw' })`
- CSS loading via dynamic `<link>` element injection

### Browser Integration
- History API for URL management
- DOM manipulation for content injection
- Event system for navigation interception

### Server Integration
- Express fallback routes serve complete HTML pages
- Static file serving for assets and styles
- 404 handling for invalid routes