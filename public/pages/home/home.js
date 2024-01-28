"use strict";
import DefaultClass from "/js/DefaultClass.js";

export default class Home extends DefaultClass {
    constructor(router) {
        super("home", router);
        this.fileCabinet();
    }

    fileCabinet() {
        const fileCabinet = document.getElementById("file-cabinet");
        this.moveElement(fileCabinet, 0, 0);
    }

    toProjects() {
        console.log(this.router);
        this.router.navigateTo("/projects");
    }

    toContactMe() {
        this.router.navigateTo("/contact");
    }

    toResume() {
        this.router.navigateTo("/resume");
    }
}
