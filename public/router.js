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
        this.urlSegs = this.segmentURL(this._getCurrentUrl());
        this._initRoute();
        this.routerOutlet = document.getElementById("router-outlet");
    }

    // in future when needed will tackle the ability to have suburls

    _getCurrentUrl() {
        return window.location.pathname;
    }

    /**
     * @description init the route
     * @TODO add in ability to load pages with suburls
     */
    _initRoute() {
        // creates an array of the path segments'
        const URL = window.location.pathname;
        this.navigateTo(this.urlSegs);
    }

    _matchUrlToRoute(urlSegs) {
        const matchedRoute = this.routes.find((route) => {
            const routePathSegs = this.segmentURL(route.path);

            // ensure that the url segs and the route path segs are equal
            return routePathSegs.every((routePathSeg, i) => {
                return routePathSeg === urlSegs[i];
            });
        });
        return matchedRoute;
    }

    // this is deconstructed because of the potential for suburls
    _loadRoute(urlSegs) {
        const matchedRoute = this._matchUrlToRoute(urlSegs);

        console.log(matchedRoute);

        if (!matchedRoute) {
            throw new Error("no route found");
            return;
        }
        this._loadPage(matchedRoute.component);
    }

    navigateTo(urlSegs) {
        window.history.pushState({}, "", urlSegs);
        this._loadRoute(urlSegs);
    }

    back() {
        window.history.back();
    }

    segmentURL(URL) {
        return URL.split("/")
            .slice(1)
            .map((seg) => `/${seg}`);
    }

    // activate the class, load in the HTML, and start it up
    async _loadPage(Component) {
        // LOAD IN HTML
        const pageName = Component.name.toLowerCase();
        console.log(pageName);
        const htmlUrl = `./pages/${pageName}/${pageName}.html`;
        const cssUrl = `./pages/${pageName}/${pageName}.css`;

        // get HTML and load
        const contentHTML = await fetch(htmlUrl)
            .then((response) => response.text())
            .catch((err) => console.log(err));

        this.routerOutlet.innerHTML = contentHTML;

        // get CSS and load
        const head = document.getElementsByTagName("HEAD")[0];
        let link = document.createElement("link");

        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = cssUrl;

        head.appendChild(link);

        // START UP CLASS
        new Component();
    }
}
