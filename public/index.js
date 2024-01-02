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
// import Contact from "./pages/js/contact.js";
// import Projects from "./pages/js/projects.js";
// import Resume from "./pages/js/resume.js";

export default class App {
    constructor() {
        const routes = [
            {
                path: "",
                templateURL: "",
            },
            {
                path: "projects/test",
                templateURL: "/pages/projects.html",
            },
            {
                path: "resume",
                templateURL: "/pages/resume.html",
            },
            {
                path: "contactme",
                templateURL: "/pages/contactme.html",
            },
        ];

        // Start routing
        const router = new Router(routes);

        // // set up button routes
        // const _resumeBtn = (document.getElementById("resume").onclick = () => {
        //     console.log("NAVIGAE");
        //     router.navigate("resume");
        // });
        // const _projectsBtn = (document.getElementById("projects").onclick =
        //     () => {
        //         router.navigate("projects");
        //     });
        // const _contactsBtn = (document.getElementById("contactme").onclick =
        //     () => {
        //         router.navigate("contactme");
        //     });

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
    }
}
// start up the initial application
new App();
