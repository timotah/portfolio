"use strict";

// Get templates using Vite's import.meta.glob (only in browser environment)  
const templates = (typeof globalThis !== 'undefined' && import.meta && import.meta.glob)
  ? {
      ...import.meta.glob("../pages/**/*.html", {
        query: "?raw", 
        import: "default",
      }),
      ...import.meta.glob("../404.html", {
        query: "?raw", 
        import: "default",
      })
    }
  : {};

// Get router outlet element dynamically
function getRouterOutlet() {
  if (typeof document === 'undefined') return null;
  return document.getElementById("router-outlet");
}

class Router {
  routes;
  currentRoute = "/";  // Initialize to root path
  currentComponent = null;
  componentCache = {};
  htmlCache = {};

  constructor(routes) {
    this.routes = routes;
    // Only set up popstate listener in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener("popstate", () => {
        this._loadRoute(window.location.pathname);
      });
    }
  }

  async _loadRoute(pathName) {
    this.currentRoute = pathName;
    // Only manipulate history in browser environment
    if (typeof window !== 'undefined' && window.history) {
      history.pushState({}, "this works", pathName);
    }

    try {
      const matchingRoute = this.routes?.find(route => route.path === pathName);
      
      if (matchingRoute && matchingRoute.component && typeof matchingRoute.component === 'function') {
        await this._loadComponentRoute(matchingRoute);
      } else {
        await this._loadTemplateRoute(pathName);
      }
    } catch (error) {
      console.error(`Route error ${pathName}:`, error);
      this._showErrorPage(pathName, error);
    }
  }

  async _loadComponentRoute(route) {
    try {
      // Clean up previous component
      if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
        this.currentComponent.destroy();
      }

      // Load new component
      this.currentComponent = this.loadComponent(route);
      await this.currentComponent.activate();
    } catch (error) {
      console.error(`Error loading component route ${route.path}:`, error);
      this._showErrorPage(route.path, error);
      throw error; // Re-throw to maintain error chain
    }
  }

  async _loadTemplateRoute(pathName) {
    try {
      const routerOutlet = getRouterOutlet();
      if (!routerOutlet) {
        throw new Error('Router outlet not found in DOM');
      }

      const html = await loadTemplate(pathName);
      
      // Extract content from the main element of the loaded HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const mainElement = doc.querySelector('main');
      
      if (mainElement) {
        // Extract just the innerHTML of the main element
        routerOutlet.innerHTML = mainElement.innerHTML;
      } else {
        // Fallback: use the entire HTML if no main element found
        routerOutlet.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error loading template route ${pathName}:`, error);
      this._showErrorPage(pathName, error);
      throw error; // Re-throw to maintain error chain
    }
  }

  navigateTo(pathName) {
    return this._loadRoute(pathName);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  _matchUrlToRoute(urlSegment) {
    const matchedRoute = this.routes.find((route) => {
      return route.path === urlSegment;
    });

    return matchedRoute;
  }

  loadComponent(route) {
    const path = route.path;

    // Check if component instance exists in cache
    if (this.componentCache[path]) {
      return this.componentCache[path];
    }

    try {
      // Create new component instance
      const ComponentClass = route.component;
      if (typeof ComponentClass !== 'function') {
        throw new Error(`Invalid component class for route ${path}`);
      }

      const componentInstance = new ComponentClass(route.componentName || path.slice(1));
      this.componentCache[path] = componentInstance;
      return componentInstance;
    } catch (error) {
      console.error(`Error creating component for route ${path}:`, error);
      throw error;
    }
  }

  _showErrorPage(pathName, error) {
    const outlet = getRouterOutlet();
    if (outlet) {
      outlet.innerHTML = `
        <div class="router-error-state" role="alert" aria-live="assertive">
          <h1>Page Not Found</h1>
          <p>Sorry, we couldn't load the page "${pathName}".</p>
          <details>
            <summary>Technical Details</summary>
            <pre>${error.message}</pre>
          </details>
          <p>
            <a href="/" class="error-home-link">Go to Home</a>
            <button onclick="location.reload()" class="error-retry-button">Try Again</button>
          </p>
        </div>
      `;
    }
  }
}

export async function loadTemplate(key) {
  try {
    // Use mockTemplates in test environment, otherwise use real templates
    const sourceTemplates = globalThis.mockTemplates || templates;
    const activeTemplates = Object.keys(sourceTemplates);
    
    // First try exact path match - look for folder name in path
    const exactMatch = activeTemplates.find(template => {
      // Extract folder name from key (e.g., '/aboutme' -> 'aboutme')
      const folderName = key.replace('/', '');
      // Match pattern like '../pages/aboutme/aboutme.html' for key '/aboutme'
      return template.includes(`/pages/${folderName}/${folderName}.html`);
    });
    
    if (exactMatch) {
      return await sourceTemplates[exactMatch]();
    }
    
    // Then try 404 fallback
    const notFoundTemplate = activeTemplates.find(template => template.includes("404.html"));
    if (notFoundTemplate) {
      return await sourceTemplates[notFoundTemplate]();
    }
    
    // Final fallback
    throw new Error(`Template not found for path: ${key}`);
  } catch (error) {
    console.error(`Error loading template for ${key}:`, error);
    throw new Error(`Failed to load template for path: ${key}. ${error.message}`);
  }
}

function interceptNavLinks() {
  if (typeof document === 'undefined') return;
  
  document.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && e.target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(e.target.href).pathname;
      
      if (router) {
        router.navigateTo(path);
      }
    }
  });
}

// Only set up DOM event listeners in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener("DOMContentLoaded", interceptNavLinks);
  
  // ARIA live region for main content
  window.addEventListener("DOMContentLoaded", () => {
    const routerOutlet = getRouterOutlet();
    if (routerOutlet) {
      routerOutlet.setAttribute("aria-live", "polite");
    }
  });
}

// Global router instance
let router = null;

// Initialize router with routes
export function initRouter(routes) {
  if (!router) {
    router = new Router(routes);
  }
  
  return router;
}

export default Router;
