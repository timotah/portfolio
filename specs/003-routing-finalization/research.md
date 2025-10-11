# Research: Routing Finalization

## File-Based Routing Implementation

**Decision**: Use existing src/pages/ directory structure to auto-discover routes  
**Rationale**: Aligns with Vite conventions, eliminates manual route configuration, reduces maintenance overhead  
**Alternatives considered**: 
- Manual route arrays (current) - rejected for maintenance burden
- Dynamic imports with explicit mapping - rejected for complexity

**Implementation Pattern**: 
```javascript
// Auto-discover routes from folder structure
const pages = import.meta.glob('./pages/*/index.js');
// Generates: /home, /aboutme, /projects, /learning, /contact
```

## Component Lifecycle Management

**Decision**: Implement activate() and destroy() methods in BaseComponent  
**Rationale**: Enables proper event listener cleanup, prevents memory leaks, allows component reuse via caching  
**Alternatives considered**:
- Full component recreation - rejected for performance cost
- Global event delegation - rejected for complexity and coupling

**Lifecycle Pattern**:
```javascript
activate() {
  this.attachEventListeners();
  this.initializeState();
}

destroy() {
  this.removeEventListeners();
  this.cleanupReferences();
}
```

## Component Caching Strategy

**Decision**: LRU-style cache with activate/deactivate pattern  
**Rationale**: Balances performance gains with memory management, prevents accumulation of unused components  
**Alternatives considered**:
- Infinite cache - rejected for memory concerns
- No caching - rejected for performance loss

**Cache Pattern**:
```javascript
componentCache = new Map(); // path -> component instance
currentComponent = null;    // active component reference
```

## HTML Fragment Injection

**Decision**: Extract content from full HTML pages using DOM parsing  
**Rationale**: Maintains server-side fallback capability while enabling SPA content injection  
**Alternatives considered**:
- Separate fragment files - rejected for duplication
- Template literal components - rejected for losing HTML structure

**Extraction Pattern**:
```javascript
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const content = doc.querySelector('main').innerHTML;
```

## CSS Loading Strategy

**Decision**: Dynamic CSS injection with component activation  
**Rationale**: Ensures styles load with components, prevents FOUC, maintains performance  
**Alternatives considered**:
- CSS-in-JS - rejected for bundle size impact
- All CSS upfront - rejected for initial load performance

**CSS Loading Pattern**:
```javascript
loadCSS(componentPath) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${componentPath}/${componentName}.css`;
  document.head.appendChild(link);
}
```

## Server-Side Fallback

**Decision**: Express catch-all route serving complete HTML pages  
**Rationale**: Provides full accessibility without JavaScript, maintains SEO capability  
**Alternatives considered**:
- Client-side only - rejected for accessibility requirements
- SSR framework - rejected for complexity and bundle size

**Server Pattern**:
```javascript
// Serve individual page files for direct access
app.get('*', (req, res) => {
  const pagePath = path.join(__dirname, 'src/pages', req.path, 'index.html');
  if (fs.existsSync(pagePath)) {
    res.sendFile(pagePath);
  } else {
    res.sendFile(path.join(__dirname, 'src/404.html'));
  }
});
```

## Progressive Enhancement

**Decision**: JavaScript-first with graceful degradation  
**Rationale**: Optimizes for modern browsers while maintaining compatibility  
**Implementation**: 
- Default server routes provide full functionality
- JavaScript enhances with SPA behavior
- No JavaScript required for basic navigation

## Bundle Size Impact

**Analysis**: 
- Component caching: ~500 bytes (Map + lifecycle methods)
- File-based routing: ~300 bytes (glob import logic)  
- HTML parsing: ~200 bytes (DOMParser usage)
- Total addition: ~1kb against 14kb budget
- **Conclusion**: Well within constitutional constraints