"use strict";

const components = import.meta.glob("/pages/**/*.js");
const templates = import.meta.glob("/pages/**/*.html", {
  query: "?raw",
  eager: true,
});
const styles = import.meta.glob("/pages/**/*.css", {
  query: "?raw",
  eager: true,
});

// Get router outlet element dynamically
function getRouterOutlet() {
  if (typeof document === "undefined") return null;
  return document.getElementById("router-outlet");
}

class Router {
  routes;
  currentRoute = "/";
  currentComponent = null;
  originalPageHtml = null;

  constructor() {
    // Only set up popstate listener in browser environment
    const routerOutlet = getRouterOutlet();
    if (routerOutlet) {
      // we always want to take the original page content before we navigate
      this.originalPageHtml = routerOutlet.innerHTML;
    }

    if (typeof window !== "undefined") {
      window.addEventListener("popstate", () => {
        this._loadRoute(window.location.pathname, true);
      });
    }

    // intiial route
    this.navigateTo(window.location.pathname);
  }

  updateActiveNavLink() {
    if (typeof document === "undefined") return;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    const currentLink = document.querySelector(`nav a[href="${this.currentRoute}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
      currentLink.focus();
    }
  }

  async _loadRoute(pathName, fromPopState = false) {
    // Only manipulate history in browser environment
    if (typeof window !== "undefined" && window.history && !fromPopState) {
      history.pushState({}, "", pathName);
    }

    this.currentRoute = pathName;
    this.updateActiveNavLink();

    try {
      await this._loadTemplateRoute(pathName);
    } catch (error) {
      console.error(`Route error ${pathName}:`, error);
      this._showErrorPage(pathName, error);
    }
  }

  async _loadComponentRoute(route) {
    try {
      // Clean up previous component
      if (
        this.currentComponent &&
        typeof this.currentComponent.destroy === "function"
      ) {
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
      if (!this.routerOutlet) {
        this.routerOutlet = getRouterOutlet();
        if (!this.routerOutlet) {
          throw new Error("Router outlet not found in DOM");
        }
      }

      const html = await this.loadTemplate(pathName);
      console.log(`Loaded template for ${pathName}:`, html);

      // Extract content from the main element of the loaded HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const mainElement = doc.querySelector("main");

      if (mainElement) {
        // Extract just the innerHTML of the main element
        this.routerOutlet.innerHTML = mainElement.innerHTML;
      } else {
        // Fallback: use the entire HTML if no main element found
        this.routerOutlet.innerHTML = html;
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

  loadTemplate(key) {
    console.log(`Loading template for key: ${key}`);
    try {
      const sourceTemplates = templates;
      console.log("Available templates:", sourceTemplates);
      const activeTemplates = Object.keys(sourceTemplates);

      // finding in existing templates stored in string map
      const exactMatch = activeTemplates.find((template) => {
        const folderName = key.replace("/", "");
        return template.includes(`/pages/${folderName}/${folderName}.html`);
      });

      if (exactMatch) {
        console.log("Template module:", sourceTemplates[exactMatch]);
        const templateModule = sourceTemplates[exactMatch];
        const html = templateModule.default;
        console.log("html: ", html);

        // Fetch the HTML content
        return html;
      }

      // attempt to find in cache
      if (key === "/") {
        return this.originalPageHtml;
      }
      // const cacheTemplate = this.htmlCache[key];
      // if (cacheTemplate) {
      //   console.log("Found in cache:", cacheTemplate);
      //   return cacheTemplate;
      // }

      console.log("No exact match, trying index.html fallback");

      // Then try 404 fallback
      // const notFoundTemplate = activeTemplates.find((template) =>
      //   template.includes("404.html"),
      // );
      // if (notFoundTemplate) {
      //   return await sourceTemplates[notFoundTemplate]();
      // }

      // Final fallback
      throw new Error(`Template not found for path: ${key}`);
    } catch (error) {
      console.error(`Error loading template for ${key}:`, error);
      throw new Error(
        `Failed to load template for path: ${key}. ${error.message}`,
      );
    }
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
      if (typeof ComponentClass !== "function") {
        throw new Error(`Invalid component class for route ${path}`);
      }

      const componentInstance = new ComponentClass(
        route.componentName || path.slice(1),
      );
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

function interceptNavLinks() {
  if (typeof document === "undefined") return;

  document.addEventListener("click", function (e) {
    if (
      e.target.tagName === "A" &&
      e.target.href.startsWith(window.location.origin)
    ) {
      e.preventDefault();
      const path = new URL(e.target.href).pathname;

      if (router) {
        console.log(`Navigating to ${path} via router`);
        router.navigateTo(path);
      }
    }
  });
}

// Only set up DOM event listeners in browser environment
if (typeof window !== "undefined") {
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
globalThis.router = null;

export function initRouter() {
  if (!router) {
    globalThis.router = new Router();
  }
}
