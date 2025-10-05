"use strict";
import BaseComponent from "../../js/BaseComponent.js";
import { projects } from "../../js/projects.js";

export default class Projects extends BaseComponent {
  constructor(router) {
    super("projects", router);
    console.log("Projects is up and running!");
    this.renderProjects();
  }

  renderProjects() {
    const list = document.getElementById('projects-list');
    const empty = document.getElementById('projects-empty');
    if (projects.length === 0) {
      list.style.display = 'none';
      empty.style.display = 'block';
      return;
    }
    projects.slice(0, 10).forEach(project => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${project.title}</strong>: ${project.description}` +
        (project.link ? ` <a href="${project.link}" target="_blank" rel="noopener">View</a>` : '');
      list.appendChild(li);
    });
    empty.style.display = 'none';
  }
}

new Projects();
