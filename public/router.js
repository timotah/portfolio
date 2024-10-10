"use strict";

/**
 * @description add in all route to new html pages here, node watch test
 *
 * TODO:
 * 1. Need to have suburls not to error out the page
 */

class Router {
    constructor(routes) {
        this.routes = routes;
        this._loadInitialRoute();
        window.addEventListener('popstate', () => {
            this._loadRoute(window.location.pathname);
        });
    }

    _loadInitialRoute() {
        const pathName = window.location.pathname;
        this._loadRoute(pathName);
    }

    _loadRoute(pathName) {
        const matchedRoute = this._matchUrlToRoute(pathName.split('/').slice(1));
        const url = `/${pathName.split('/').slice(1).join('/')}`;
        history.pushState({}, 'this works', url);

        const routerOutlet = document.getElementById('router-outlet');
        routerOutlet.innerHTML = matchedRoute.template;
    }

    navigateTo(pathName) {
        this._loadRoute(pathName);
    }

    _matchUrlToRoute(urlSegments) {
        const matchedRoute = this.routes.find(route => {
            const routePathSegments = route.path.split('/').slice(1);

            if (routePathSegments.length !== urlSegments.length) {
                return false;
            }

            return routePathSegments.every((routePathSegment, i) => routePathSegment === urlSegments[i]);
        });

        return matchedRoute;
    }
}

const routes = [
    { path: '/', template: '<h1>Home</h1>' },
    { path: '/about', template: '<h1>About</h1>' },
    { path: '/contact', template: '<h1>Contact</h1>' }
];

const router = new Router(routes);


//     // activate the class, load in the HTML, and start it up
//     async _loadPage(Component) {
//         // LOAD IN HTML
//         const pageName = Component.name;
//         const pageNameLower = Component.name.toLowerCase();
//         const htmlUrl = `/pages/${pageNameLower}/${pageNameLower}.html`;
//         const cssUrl = `/pages/${pageNameLower}/${pageNameLower}.css`;

//         // get HTML and load
//         const contentHTML = await fetch(htmlUrl)
//             .then((response) => response.text())
//             .catch((err) => console.log(err));

//         this.routerOutlet.innerHTML = contentHTML;

//         // get CSS and load
//         let link = document.querySelector("[component-styles]");

//         link.rel = "stylesheet";
//         link.type = "text/css";
//         link.href = cssUrl;

//         // START UP CLASS - can call functions in onclick from window component
//         window[pageName] = new Component(this.routerInstance);
//     }
// }
