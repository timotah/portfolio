"use strict";
import BaseComponent from "../../js/BaseComponent.js";
import { contactMethods } from "../../js/contactMethods.js";

export default class ContactMe extends BaseComponent {
  constructor(router) {
    super("contactme", router);
    console.log("Contacts is up and running!");
    this.renderContacts();
  }

  renderContacts() {
    const list = document.getElementById('contact-list');
    const empty = document.getElementById('contact-empty');
    if (contactMethods.length === 0) {
      list.style.display = 'none';
      empty.style.display = 'block';
      return;
    }
    contactMethods.slice(0, 5).forEach(method => {
      const li = document.createElement('li');
      if (method.type === 'Email') {
        li.innerHTML = `<a href="mailto:${method.value}">${method.value}</a>`;
      } else if (method.type === 'Twitter') {
        li.innerHTML = `<a href="https://twitter.com/${method.value.replace('@','')}" target="_blank" rel="noopener">${method.value}</a>`;
      } else if (method.type === 'LinkedIn') {
        li.innerHTML = `<a href="${method.value}" target="_blank" rel="noopener">LinkedIn</a>`;
      } else {
        li.textContent = `${method.type}: ${method.value}`;
      }
      list.appendChild(li);
    });
    empty.style.display = 'none';
  }
}

new ContactMe();
