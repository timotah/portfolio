"use strict";

/** things still needed
 * 1. need to ensure templates load when going to a path
 * 2. need to ensure that the path is updated when clicking on a button
 * 3. need to ensure that the path is updated when going backward
 * 4. Need to investigate on how to prevent paths from being overloaded
 * 5. Keep resume in S3 to avoid it being loaded in with static every time? - finished site problem
 *
 */

import Router from "./router.js";
import Home from "./pages/home/home.js";
import Contact from "./pages/contact/contact.js";
import Projects from "./pages/projects/projects.js";
import Resume from "./pages/resume/resume.js";

export default class App {
    constructor() {
        const routes = {
            "/": Home,
            "/projects": Projects,
            "/resume": Resume,
            "/contactme": Contact,
        };

        // Start routing
        const router = new Router(routes);

        // navigate functions
        document.addEventListener("DOMContentLoaded", () => {
            console.log("adding navigation to buttons");
            document.querySelectorAll("[page]").forEach((element) => {
                if (routes.find((route) => route.path === element.id)) {
                    element.onclick = () => {
                        console.log("HERE");
                        router.navigate(element.id);
                    };
                }
            });
        });

        // need to bind for the browsers forward and back buttons
        window.addEventListener("popstate", () => {
            router._loadInitialRoute();
        });
    }
}
// start up the initial application
new App();
