"use strict";

// import { Router } from "./router.js";

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
