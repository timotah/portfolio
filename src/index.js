"use strict";

import { initRouter } from "./js/router.js";
import { routes } from "./js/routes.js";
import { portfolioOwner } from "./js/portfolioOwner.js";

export default class App {
  constructor() {
    initRouter(routes);
    this.renderOwnerInfo();
  }

  renderOwnerInfo() {
    const section = document.querySelector('section[aria-label="Portfolio Owner Info"]');
    if (section) {
      section.querySelector('h2').textContent = `Welcome, I'm ${portfolioOwner.name}!`;
    }
  }
}
new App();

