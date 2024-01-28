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
        this.routerInstance;
        // delete routes[0];

        this.routes = routes;
        this._initRoute();
        this.routerOutlet = document.getElementById("router-outlet");
    }

    appendInstance(router) {
        this.routerInstance = router;
    }

    // in future when needed will tackle the ability to have suburls

    get currentUrl() {
        return window.location.pathname;
    }

    /**
     * @description init the route
     * @TODO add in ability to load pages with suburls
     */
    _initRoute() {
        // creates an array of the path segments'
        this.navigateTo(this.currentUrl);
    }

    _matchUrlToRoute(urlSegs) {
        const matchedRoute = this.routes.find((route) => {
            const routePathSegs = this.segmentURL(route.path);
            // ensure that the url segs and the route path segs are equal
            return routePathSegs.every((routePathSeg, i) => {
                console.log(routePathSeg, urlSegs[i]);
                return routePathSeg === urlSegs[i];
            });
        });
        return matchedRoute;
    }

    // this is deconstructed because of the potential for suburls
    _loadRoute(urlSegs) {
        const matchedRoute = this._matchUrlToRoute(urlSegs);

        if (!matchedRoute) {
            throw new Error("no route found");
            return;
        }
        this._loadPage(matchedRoute.component);
    }

    navigateTo(url) {
        const urlSegs = this.segmentURL(url);
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
        const pageName = Component.name;
        const pageNameLower = Component.name.toLowerCase();
        const htmlUrl = `/pages/${pageNameLower}/${pageNameLower}.html`;
        const cssUrl = `/pages/${pageNameLower}/${pageNameLower}.css`;

        // get HTML and load
        const contentHTML = await fetch(htmlUrl)
            .then((response) => response.text())
            .catch((err) => console.log(err));

        this.routerOutlet.innerHTML = contentHTML;

        // get CSS and load
        let link = document.querySelector("[component-styles]");

        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = cssUrl;

        // START UP CLASS - can call functions in onclick from window component
        window[pageName] = new Component(this.routerInstance);
    }
}
