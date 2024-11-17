"use strict";
import BaseComponent from "../../js/BaseComponent.js";

export default class Resume extends BaseComponent {
  constructor(router) {
    super("resume", router);
    console.log("Resume is up and running!");
  }
}
