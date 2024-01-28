"use strict";
import DefaultClass from "/js/defaultClass.js";
export default class Resume extends DefaultClass {
    constructor(router) {
        super("resume", router);
        console.log("Resume is up and running!");
    }
}
