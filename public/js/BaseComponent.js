"use strict";

export default class BaseComponent {
  componentName;
  constructor(componentName) {
    this.componentName = componentName;
    this.cssUrl = `../pages/${componentName}/${componentName}.css`;
    this.htmlUrl = `../pages/${componentName}/${componentName}.html`;
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

  async loadComponentHtml() {
    console.log("Loading HTML for", this.componentName);
    try {
      console.log("fetching", this.htmlUrl);
      const response = await fetch(this.htmlUrl);
      console.log(response);
      if (!response.ok) {
        console.log("here?");
        throw new Error(`Failed to load ${this.componentName}.html`);
      }
      const htmlContent = await response.text();
      console.log(htmlContent);
      return htmlContent;
    } catch (error) {
      console.error(error);
      return `<p>Error loading component: ${this.componentName}</p>`;
    }
  }
}
