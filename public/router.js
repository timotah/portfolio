"use strict";

/**
 * @description add in all route to new html pages here, node watch test
 */

// I am making an SPA, while this is not SEO
export default class Router {
    constructor(routes) {
        this.routes = routes;
        this._initRoute();
    }

    _initRoute() {
        const pathSegs = window.location.pathname.split("/").slice(1);
        this.navigate(...pathSegs);
    }

    _getURL() {
        const path = window.location.pathname;
        return path;
    }

    _matchUrlToRoute(segment) {
        console.log("seg", segment);
        const matchedRoute = this.routes.find(
            (route) => route.path === segment[0]
        );
        return matchedRoute;
    }

    validateRoute(...urlSegs) {
        const matchedRoute = this._matchUrlToRoute(urlSegs);
        console.log("matched", matchedRoute);
        if (!matchedRoute) {
            console.log(matchedRoute);
            throw new Error("Route not found");
        }
        return matchedRoute;
    }

    navigate(path) {
        window.history.pushState({}, "", path);
        this._loadPage(this.validateRoute(path).templateURL);
    }

    async _loadPage(url) {
        console.log("fetching", url);
        const routerOutlet = document.getElementById("router-outlet");
        // using async/await and then/catch in combination because .text() returns a promise here and allows for simple error handling
        const contentHTML = await fetch(url)
            .then((response) => response.text())
            .catch((err) => console.log(err));
        routerOutlet.innerHTML = contentHTML;
    }
}
