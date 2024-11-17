"use strict";

import BaseComponent from "../../js/BaseComponent.js";

export default class Home extends BaseComponent {
  constructor() {
    const componentName = "home";
    super(componentName);
    console.log(`${componentName} triggered`);
  }
}
