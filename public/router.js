"use strict";

/**
 * @description add in all route to new html pages here, node watch test
 *
 * TODO:
 * 1. Need to have suburls not to error out the page
 */

// I am making an SPA, while this is not SEO
export default class Router {
    constructor(routes) {
        this.routes = routes;
        this._initRoute();
    }

    _getCurrentUrl() {
        return window.location.pathname;
    }

    /**
     * @description init the route
     * @TODO add in ability to load pages with suburls
     */
    _initRoute() {
        // creates an array of the path segments
        const urlSegs = window.location.pathname.split("/").slice(1);
        this.navigate(...urlSegs);
    }

    _matchUrlToRoute(urlSegs) {
        const matchedRoute = this.routes.find(
            (route) => route.path === urlSegs
        );
        return matchedRoute;
    }

    // this is deconstructed because of the potential for suburls
    _loadRoute(...urlSegs) {
        const matchedRoute = this._matchUrlToRoute(urlSegs);

        if (!matchedRoute) {
            throw new Error("no route found");
            return;
        }
        this._loadPage(matchedRoute.templateURL);
    }

    navigateTo(urlSegs) {
        window.history.pushState({}, "", url);
        this._loadPage(matchedRoute);
    }

    back() {
        window.history.back();
    }

    async _loadPage(url) {
        // LOAD IN HTML
        const routerOutlet = document.getElementById("router-outlet");

        // using async/await and then/catch in combination because .text() returns a promise here and allows for simple error handling
        const contentHTML = await fetch(url)
            .then((response) => response.text())
            .catch((err) => console.log(err));
        routerOutlet.innerHTML = contentHTML;

        // CONNECT JS FILES

        // CONNECT CSS FILES
    }
}
