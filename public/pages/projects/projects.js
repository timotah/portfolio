"use strict";
import DefaultClass from "/js/defaultClass.js";
export default class Projects extends DefaultClass {
    constructor(router) {
        super("projects", router);
        console.log("Projects is up and running!");
    }
}
