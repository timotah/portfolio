# Quickstart: Routing Finalization

## Overview
This quickstart validates the SPA routing with component caching and server-side fallback functionality.

## Prerequisites
- Node.js and npm installed
- Portfolio repository cloned and dependencies installed
- Branch `003-routing-finalization` checked out

## Setup
```bash
# Install dependencies
npm install

# Build the application  
npm run build

# Start the development server
npm run dev
```

## Test Scenarios

### Scenario 1: SPA Navigation
**Objective**: Verify client-side routing works with component caching

1. Open browser to `http://localhost:5173`
2. Verify home page loads
3. Click "Projects" link in navigation
4. **Expected**: Page content updates without full reload, URL changes to `/projects`
5. Click "Contact" link
6. **Expected**: Page content updates without full reload, URL changes to `/contact`
7. Click "Home" link
8. **Expected**: Fast loading (cached component), URL changes to `/`

**Success Criteria**:
- ✅ No full page reloads during navigation
- ✅ URL updates correctly in address bar
- ✅ Content changes appropriately for each page
- ✅ Return to home is noticeably faster (component cache working)

### Scenario 2: Direct URL Access
**Objective**: Verify server-side fallback provides complete pages

1. Open browser directly to `http://localhost:3000/projects`
2. **Expected**: Complete projects page loads with full navigation and styling
3. Navigate directly to `http://localhost:3000/contact`
4. **Expected**: Complete contact page loads with full navigation and styling
5. Navigate directly to `http://localhost:3000/nonexistent`
6. **Expected**: 404 page displays with navigation back to home

**Success Criteria**:
- ✅ All pages load completely when accessed directly
- ✅ Navigation and styling work without JavaScript
- ✅ 404 handling works for invalid routes

### Scenario 3: JavaScript Disabled
**Objective**: Verify full functionality without JavaScript

1. Disable JavaScript in browser
2. Navigate to `http://localhost:3000`
3. Click navigation links
4. **Expected**: Each link navigates to complete page via server-side routing
5. Verify all content and styling loads correctly
6. Test form submissions (if any) work

**Success Criteria**:
- ✅ All navigation works via standard HTTP requests
- ✅ Complete page content loads for each route
- ✅ Styling and layout remain functional
- ✅ No JavaScript errors or broken functionality

### Scenario 4: Component Lifecycle
**Objective**: Verify components properly activate/deactivate

1. Enable browser developer tools console
2. Navigate between pages and monitor console output
3. **Expected**: See component activation/deactivation logs
4. Check for memory leaks by navigating extensively
5. **Expected**: Event listeners properly cleaned up

**Success Criteria**:
- ✅ Components log activation when becoming visible
- ✅ Components log deactivation when hidden
- ✅ No accumulating event listeners in DOM
- ✅ No memory leak warnings in browser tools

### Scenario 5: CSS Loading
**Objective**: Verify component styles load dynamically

1. Navigate to home page
2. Inspect page styles in developer tools
3. Navigate to projects page
4. **Expected**: Projects-specific CSS loads without page reload
5. Navigate back to home
6. **Expected**: Home styles remain active

**Success Criteria**:
- ✅ Component-specific CSS loads on navigation
- ✅ No FOUC (Flash of Unstyled Content)
- ✅ Styles persist when returning to cached components
- ✅ Global styles remain consistent

### Scenario 6: Error Handling
**Objective**: Verify graceful error handling

1. Navigate to invalid route: `http://localhost:3000/invalid`
2. **Expected**: 404 page displays with navigation
3. Simulate component failure (comment out component export)
4. **Expected**: Error state displayed, navigation still works
5. Restore component and verify recovery

**Success Criteria**:
- ✅ Invalid routes show 404 page
- ✅ Component errors don't break entire application
- ✅ Navigation remains functional during errors
- ✅ Error recovery works when issues resolved

## Performance Validation

### Bundle Size Check
```bash
# Check built bundle size
npm run build
ls -la dist/assets/

# Verify total size under 14kb constitutional limit
du -sh dist/
```

**Success Criteria**:
- ✅ Total bundle size remains under 14kb
- ✅ No significant size increase from routing features

### Load Time Testing
1. Open network tab in browser developer tools
2. Navigate to fresh page (disable cache)
3. **Expected**: Initial load under 2 seconds on throttled 3G
4. Navigate between cached pages
5. **Expected**: Navigation under 100ms

**Success Criteria**:
- ✅ Initial page load meets performance targets
- ✅ Cached navigation is significantly faster
- ✅ No performance regressions from caching

## Accessibility Validation

### Screen Reader Testing
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through the application
3. **Expected**: All content accessible, navigation clear
4. Test with JavaScript disabled
5. **Expected**: Same accessibility without JavaScript

**Success Criteria**:
- ✅ Screen reader announces page changes
- ✅ Navigation structure clear and logical
- ✅ All interactive elements accessible
- ✅ Accessibility maintained without JavaScript

### Keyboard Navigation
1. Use only Tab and Enter keys to navigate
2. **Expected**: All navigation links reachable and usable
3. Test form controls (if any) with keyboard only
4. **Expected**: All functionality accessible via keyboard

**Success Criteria**:
- ✅ All navigation accessible via keyboard
- ✅ Focus indicators visible and clear
- ✅ No keyboard traps
- ✅ Logical tab order maintained

## Cleanup
```bash
# Stop development server
Ctrl+C

# Return to main branch (if testing complete)
git checkout main
```

## Troubleshooting

### Common Issues
- **Route not found**: Check file structure matches expected pattern
- **Component not activating**: Verify component extends BaseComponent and implements lifecycle methods
- **CSS not loading**: Check CSS file paths and dynamic loading implementation
- **Server fallback not working**: Verify Express catch-all route configuration

### Debug Commands
```bash
# Check file structure
find src/pages -name "*.html" -o -name "*.js" -o -name "*.css"

# Verify build output
npm run build && ls -la dist/

# Check server routes
curl -v http://localhost:3000/projects
```