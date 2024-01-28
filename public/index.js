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
import Projects from "./pages/projects/projects.js";
import Resume from "./pages/resume/resume.js";
import ContactMe from "./pages/contactme/contactme.js";
export default class App {
    constructor() {
        // Start routing

        const routes = [
            { path: "/", component: Home },
            { path: "/projects", component: Projects },
            { path: "/resume", component: Resume },
            { path: "/contactme", component: ContactMe },
        ];

        const router = new Router(routes);
        router.appendInstance(router);

        console.log("App is up and running!");

        // need to bind for the browsers forward and back buttons
        // window.addEventListener("popstate", () => {
        //     router._loadInitialRoute();
        // });
    }
}
// start up the initial application
new App();
