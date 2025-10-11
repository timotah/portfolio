"use strict";

export default class BaseComponent {
  componentName;
  isActive = false;
  
  constructor(componentName) {
    this.componentName = componentName;
    this.cssUrl = `/pages/${componentName}/${componentName}.css`;
    this.htmlUrl = `/pages/${componentName}/${componentName}.html`;
    // this.loadCSS();
  }

  async activate() {
    if (this.isActive) {
      return this;
    }
    
    try {
      await this.loadCSS();
      await this.loadHTML();
      this.isActive = true;
      return this;
    } catch (error) {
      console.error(`Failed to activate component ${this.componentName}:`, error);
      this.showErrorState(error);
      throw error; // Re-throw to allow router to handle
    }
  }

  destroy() {
    if (!this.isActive) {
      return;
    }
    
    this.removeCSS();
    this.clearHTML();
    this.isActive = false;
  }

  async loadCSS() {
    const existingLink = document.querySelector(`link[href*="${this.componentName}.css"]`);
    if (existingLink) {
      return;
    }
    
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.cssUrl;
      
      // Add error and load event handlers
      return new Promise((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => {
          console.warn(`Could not load CSS for ${this.componentName}: ${this.cssUrl}`);
          resolve(); // Don't reject - CSS loading failure shouldn't break the component
        };
        
        document.head.appendChild(link);
        
        // Timeout fallback - resolve after 3 seconds even if no load event
        setTimeout(() => resolve(), 3000);
      });
    } catch (error) {
      console.warn(`Error setting up CSS for ${this.componentName}:`, error);
      // Don't throw - CSS loading failure shouldn't break the component
    }
  }

  async loadHTML() {
    try {
      const html = await this.loadComponentHtml();
      const outlet = document.getElementById('router-outlet');
      if (!outlet) {
        throw new Error('Router outlet not found in DOM');
      }
      outlet.innerHTML = html;
    } catch (error) {
      console.error(`Failed to load HTML for ${this.componentName}:`, error);
      throw error; // Re-throw to trigger error state
    }
  }

  clearHTML() {
    const outlet = document.getElementById('router-outlet');
    if (outlet) {
      outlet.innerHTML = '';
    }
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
    try {
      const fullUrl = new URL(this.htmlUrl, window.location.origin).href;
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${fullUrl}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading ${this.componentName}:`, error);
      throw error;
    }
  }

  showErrorState(error) {
    const outlet = document.getElementById('router-outlet');
    if (outlet) {
      outlet.innerHTML = `
        <div class="error-state" role="alert" aria-live="assertive">
          <h2>Error Loading Page</h2>
          <p>Sorry, there was an error loading the "${this.componentName}" page.</p>
          <details>
            <summary>Technical Details</summary>
            <pre>${error.message}</pre>
          </details>
          <p>
            <a href="/" class="error-home-link">← Return to Home</a>
            <button onclick="location.reload()" class="error-retry-button">Try Again</button>
          </p>
        </div>
      `;
    }
  }
}
