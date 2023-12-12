"use strict";

// import { Router } from "./router.js";

/** things still needed
 * 1. need to ensure templates load when going to a path
 * 2. need to ensure that the path is updated when clicking on a button
 * 3. need to ensure that the path is updated when going backward
 * 4. Need to investigate on how to prevent paths from being overloaded
 * 5. Keep resume in S3 to avoid it being loaded in with static every time? - finished site problem
 *
 */

import Router from "./router.js";

const routes = [
    {
        path: "",
        templateURL: "nothing",
    },
    {
        path: "projects",
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

const router = new Router(routes);
function logIt(message) {
    console.log(message);
}

// set up button routes
const _resumeBtn = (document.getElementById("resume").onclick = () => {
    router.navigate("resume");
});
const _projectsBtn = (document.getElementById("projects").onclick = () => {
    router.navigate("projects");
});
const _contactsBtn = (document.getElementById("contactme").onclick = () => {
    router.navigate("contactme");
});
