"use strict";

import BaseComponent from "../../js/BaseComponent.js";
import { portfolioOwner } from "../../js/portfolioOwner.js";

export default class Home extends BaseComponent {
  constructor() {
    const componentName = "home";
    super(componentName);
    this.renderOwnerInfo();
  }

  renderOwnerInfo() {
    // Example: dynamically update owner info if needed
    const section = document.querySelector('section[aria-label="Portfolio Owner Info"]');
    if (section) {
      section.querySelector('h2').textContent = `Welcome, I'm ${portfolioOwner.name}!`;
    }
  }
}

new Home();
