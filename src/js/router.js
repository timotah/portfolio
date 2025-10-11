"use strict";

/**
 * @description add in all route to new html pages here, node watch test
 *
 * TODO:
 * 1. Need to have suburls not to error out the page
 */

// Vite template glob import
const templates = import.meta.glob("/pages/**/*.html", {
  query: "?raw",
  import: "default",
});

class Router {
  routes;
  componentCache = {};
  htmlCache = {};

  constructor(routes) {
    this.routes = routes;
    // this._loadInitialRoute();
    window.addEventListener("popstate", () => {
      this._loadRoute(window.location.pathname);
    });
  }

  // _loadInitialRoute() {
  //   const pathName = window.location.pathname;
  //   this._loadRoute(pathName);
  // }

  async _loadRoute(pathName) {
    console.log(`Loading route for ${pathName}`);
    history.pushState({}, "this works", pathName);

    const routerOutlet = document.getElementById("router-outlet");
    // Load HTML template using Vite's import.meta.glob
    const html = await loadTemplate(pathName);
    console.log("Loaded HTML:", html);
    routerOutlet.innerHTML = html;
  }

  navigateTo(pathName) {
    this._loadRoute(pathName);
  }

  _matchUrlToRoute(urlSegment) {
    const matchedRoute = this.routes.find((route) => {
      return route.path === urlSegment;
    });

    return matchedRoute;
  }

  // components called via the router will only need single instance use
  // the only components that should be able to exist multiple times are those that are page specific
  loadComponent(route) {
    const path = route.path;

    // Check if component instance exists in cache
    if (this.componentCache[path]) {
      return this.componentCache[path];
    }

    // Create and cache new instance if not found
    const component = new route.component();
    this.componentCache[path] = component;
    return component;
  }
}

const routerOutlet =
  document.getElementById("router-outlet") || document.querySelector("main");

// Helper to load HTML template by route
async function loadTemplate(routePath) {
  // Normalize routePath to match template keys
  let key = `/pages${routePath}${routePath}.html`;
  console.log(`Attempting to load template for key: ${key}`);

  if (!(key in templates)) {
    // fallback to 404
    key = "/404.html";
  }
  console.log(`Loading template for ${key}`);
  console.log(templates);
  return await templates[key]();
}

function interceptNavLinks() {
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only intercept if JS is enabled and link is internal
      if (
        link.hostname === window.location.hostname &&
        !link.hasAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        router.navigateTo(link.getAttribute("href"));
        // Accessibility: move focus to main content
        if (routerOutlet) {
          routerOutlet.setAttribute("tabindex", "-1");
          routerOutlet.focus();
        }
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", interceptNavLinks);

// ARIA live region for main content
if (routerOutlet) {
  routerOutlet.setAttribute("aria-live", "polite");
}

// Global router instance
let router = null;

// Initialize router with routes
export function initRouter(routes) {
  if (!router) {
    router = new Router(routes);
  }
  console.log("Router initalized");
  return router;
}

export default Router;
