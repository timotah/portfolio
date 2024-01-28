"use strict";
import DefaultClass from "/js/defaultClass.js";

export default class Home extends DefaultClass {
    constructor(routerInstance) {
        super("home");
        this.router = routerInstance;
        this.fileCabinet();
    }

    fileCabinet() {
        const fileCabinet = document.getElementById("file-cabinet");
        this.moveElement(fileCabinet, 0, 0);
    }

    hello() {
        console.log(this.router);
        this.router.navigateTo("/projects");
    }
}
