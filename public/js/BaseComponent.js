"use strict";

export default class BaseComponent {
  componentName;
  constructor(componentName) {
    this.componentName = componentName;
    this.cssUrl = `./${componentName}/${componentName}.css`;
    this.htmlUrl = `./${componentName}/${componentName}.html`;
    // this.loadCSS();
  }

  removeCSS() {
    let link = document.getElementsByTagName("LINK");
    for (let i = 0; i < link.length; i++) {
      if (link[i].href.includes(this.cssUrl)) {
        // parent note of link is head, so we remove child link
        link[i].parentNode.removeChild(link[i]);
      }
    }
  }

  template() {
    return; /*html*/
  }

  async loadComponentHtml(componentName) {
    try {
      const response = await fetch(this.htmlUrl);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentName}.html`);
      }
      const htmlContent = await response.text();
      return htmlContent;
    } catch (error) {
      console.error(error);
      return `<p>Error loading component: ${componentName}</p>`;
    }
  }
}
