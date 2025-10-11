"use strict";

import Home from "../pages/home/home.js";
import Projects from "../pages/projects/projects.js";
import Resume from "../pages/aboutme/aboutme.js";
import Contact from "../pages/contact/contact.js";

export const routes = [
  { path: "/", component: Home },
  { path: "/projects", component: Projects },
  { path: "/resume", component: Resume },
  { path: "/contact", component: Contact },
];
