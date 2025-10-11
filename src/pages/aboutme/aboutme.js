"use strict";
import BaseComponent from "../../js/BaseComponent.js";
import { portfolioOwner } from "../../js/portfolioOwner.js";

export default class Resume extends BaseComponent {
  constructor(router) {
    super("resume", router);
    this.renderOwnerInfo();
    this.renderResume();
  }

  renderOwnerInfo() {
    document.getElementById('owner-bio').textContent = portfolioOwner.credentials;
    const contacts = document.getElementById('owner-contacts');
    portfolioOwner.contactMethods.forEach(method => {
      const li = document.createElement('li');
      if (method.type === 'Email') {
        li.innerHTML = `<a href="mailto:${method.value}">${method.value}</a>`;
      } else if (method.type === 'Twitter') {
        li.innerHTML = `<a href="https://twitter.com/${method.value.replace('@','')}" target="_blank" rel="noopener">${method.value}</a>`;
      } else {
        li.textContent = `${method.type}: ${method.value}`;
      }
      contacts.appendChild(li);
    });
  }

  renderResume() {
    document.getElementById('resume-content').textContent = portfolioOwner.credentials;
  }
}

// new Resume();
