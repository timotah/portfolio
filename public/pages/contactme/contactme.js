"use strict";
import DefaultClass from "/js/DefaultClass.js";
export default class ContactMe extends DefaultClass {
    constructor(router) {
        super("contactme", router);
        console.log("Contacts is up and running!");
    }
}
