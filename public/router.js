"use strict";

/**
 * @description add in all route to new html pages here, node watch test
 *
 * TODO:
 * 1. Need to have suburls not to error out the page
 */

import { routes } from "./routes.js";
// const routes = {};
class Router {
  routes;
  componentCache = {};
  htmlCache = {};

  constructor(routes) {
    this.routes = routes;
    this._loadInitialRoute();
    window.addEventListener("popstate", () => {
      this._loadRoute(window.location.pathname);
    });
  }

  _loadInitialRoute() {
    const pathName = window.location.pathname;
    this._loadRoute(pathName);
  }

  async _loadRoute(pathName) {
    const matchedRoute = this._matchUrlToRoute(pathName);
    const url = `/${pathName.split("/").slice(1).join("/")}`;
    history.pushState({}, "this works", url);

    const routerOutlet = document.getElementById("router-outlet");
    routerOutlet.innerHTML = await this.loadComponent(
      matchedRoute
    ).loadComponentHtml();
  }

  navigateTo(pathName) {
    this._loadRoute(pathName);
  }

  _matchUrlToRoute(urlSegment) {
    console.log(urlSegment);
    const matchedRoute = this.routes.find((route) => {
      console.log(route.path);
      return route.path === urlSegment;
    });

    return matchedRoute;
  }

  // components called via the router will only need single instance use
  // the only components that should be able to exist multiple times are those that are page specific
  loadComponent(route) {
    console.log(route);
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

export const router = new Router(routes);
