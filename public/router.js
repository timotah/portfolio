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

    // edit to load in
    _initRoute() {
        // creates an array of the path segments
        const urlSegs = window.location.pathname.split("/").slice(1);
        this.navigate(...urlSegs);
    }

    _matchUrlToRoute(urlSegs) {
        const matchedRoute = this.routes.find((route) => {
            const routePathSegs = route.path.split("/").slice(1);
            if (routePathSegs.length !== urlSegs.length) {
                return false;
            }
            return routePathSegs.every(
                (routePathSeg, i) => routePathSeg === urlSegs[i]
            );
        });
        console.log(matchedRoute);
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

    navigate(urlSegs) {
        console.log("NAVIGATE URL SEGS", urlSegs);
        const matchedRoute = this.validateRoute(urlSegs);
        // correctly format the url with /
        const url = `/${urlSegs.join("/")}`;

        window.history.pushState({}, "", url);

        this._loadPage(matchedRoute.templateURL);
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
