"use strict";

/** things still needed
 *
 * 1. need to ensure templates load when going to a path
 * 2. need to ensure that the path is updated when clicking on a button
 * 3. need to ensure that the path is updated when going backward
 * 4. Need to investigate on how to prevent paths from being overloaded
 * 5. Keep resume in S3 to avoid it being loaded in with static every time? - finished site problem
 *
 */
import { initRouter } from "./js/router.js";
import { routes } from "./js/routes.js";
import BaseComponent from "./js/BaseComponent.js";
import { portfolioOwner } from "./js/portfolioOwner.js";

// beginning of the application javascript, this is where it all starts and i create the frontend router
export default class App {
  constructor() {
    console.log("App initialized");
    initRouter(routes);
    console.log("Router initialized");
    // define all base routes here, suburls will later be handled in respective modules
    // start routing
    const componentName = "home";
    // super(componentName);
    // console.log(`${componentName} triggered`);
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
// start up the initial application
new App();

