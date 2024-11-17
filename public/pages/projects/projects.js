"use strict";
import BaseComponent from "../../js/BaseComponent.js";
export default class Projects extends BaseComponent {
  constructor(router) {
    super("projects", router);
    console.log("Projects is up and running!");
  }
}
