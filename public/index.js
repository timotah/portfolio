"use strict";

// import { Router } from "./router.js";

import Router from "./router.js";

const routes = [
    {
        path: "",
        callback: () => {
            console.log("homepage");
        },
    },
    {
        path: "projects",
        callback: () => {
            console.log("projects");
        },
    },
    {
        path: "resume",
        callback: () => {
            console.log("resume");
        },
    },
    {
        path: "contactme",
        callback: () => {
            console.log("contactme");
        },
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
