"use strict";
import DefaultClass from "/js/defaultClass.js";
export default class Home extends DefaultClass {
    constructor() {
        super("home");
        console.log("Home is up and running!");
        this.fileCabinet();
    }

    fileCabinet() {
        const fileCabinet = document.getElementById("file-cabinet");
        this.moveElement(fileCabinet, 0, 0);
    }
}
