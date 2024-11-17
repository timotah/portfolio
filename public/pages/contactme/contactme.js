"use strict";
import BaseComponent from "../../js/BaseComponent.js";
export default class ContactMe extends BaseComponent {
  constructor(router) {
    super("contactme", router);
    console.log("Contacts is up and running!");
  }
}
