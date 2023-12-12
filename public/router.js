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
        this.loadRoute(...pathSegs);
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

    loadRoute(...urlSegs) {
        const matchedRoute = this._matchUrlToRoute(urlSegs);
        if (!matchedRoute) {
            console.log(matchedRoute);
            throw new Error("Route not found");
        }
        matchedRoute.callback();
    }

    navigate(path) {
        window.history.pushState({}, "", path);
        this.loadRoute(path);
    }

    _loadPage(url) {
        return fetch(url)
            .then((response) => response.text())
            .catch((error) => {
                console.warn(error);
            });
    }
}
