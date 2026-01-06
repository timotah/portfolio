"use strict";

import { GridContainer } from '../../js/gridContainer.js';
import { GridWidget } from '../../js/gridWidget.js';



const presets = {
  preset1: [
    { id: 'widget1', title: 'About Me', content: '<h3>About Me</h3><p>Fullstack Developer with 5 years experience</p>', col: 1, row: 1, colSpan: 4, rowSpan: 4 },
    { id: 'widget2', title: 'Projects', content: '<h3>Projects</h3><p>Check out my latest work</p>', col: 5, row: 1, colSpan: 4, rowSpan: 4 },
    { id: 'widget3', title: 'Contact', content: '<h3>Contact</h3><p>Get in touch!</p>', col: 9, row: 1, colSpan: 4, rowSpan: 4 },
    { id: 'widget4', title: 'Skills', content: '<h3>Skills</h3><p>JavaScript, Node.js, React, Python</p>', col: 1, row: 5, colSpan: 6, rowSpan: 4 },
    { id: 'widget5', title: 'Learning', content: '<h3>Current Learning</h3><p>Exploring new technologies</p>', col: 7, row: 5, colSpan: 6, rowSpan: 4 }
  ],
  preset2: [
    { id: 'widget1', title: 'Hero', content: '<h3>Hi, I\'m Tim</h3><p>Fullstack Developer</p>', col: 1, row: 1, colSpan: 12, rowSpan: 3 },
    { id: 'widget2', title: 'Projects', content: '<h3>Featured Projects</h3><p>My best work</p>', col: 1, row: 4, colSpan: 6, rowSpan: 5 },
    { id: 'widget3', title: 'About', content: '<h3>About Me</h3><p>Learn more</p>', col: 7, row: 4, colSpan: 6, rowSpan: 5 },
    { id: 'widget4', title: 'Contact', content: '<h3>Contact Info</h3><p>Email, GitHub, LinkedIn</p>', col: 1, row: 9, colSpan: 12, rowSpan: 3 }
  ],
  preset3: [
    { id: 'widget1', title: 'Intro', content: '<h3>Welcome!</h3><p>This is my portfolio</p>', col: 1, row: 1, colSpan: 6, rowSpan: 3 },
    { id: 'widget2', title: 'Contact', content: '<h3>Contact</h3><p>tim@radtke.dev</p>', col: 7, row: 1, colSpan: 6, rowSpan: 3 },
    { id: 'widget3', title: 'Project 1', content: '<h3>Project A</h3><p>Description</p>', col: 1, row: 4, colSpan: 4, rowSpan: 4 },
    { id: 'widget4', title: 'Project 2', content: '<h3>Project B</h3><p>Description</p>', col: 5, row: 4, colSpan: 4, rowSpan: 4 },
    { id: 'widget5', title: 'Project 3', content: '<h3>Project C</h3><p>Description</p>', col: 9, row: 4, colSpan: 4, rowSpan: 4 },
    { id: 'widget6', title: 'Skills', content: '<h3>Tech Stack</h3><p>JS, Python, Go</p>', col: 1, row: 8, colSpan: 12, rowSpan: 3 }
  ]
};

let currentPreset = 'preset1';
let grid = null;
let isCustom = false;

function updatePresetDisplay() {
  const presetButtons = document.getElementById('preset-buttons');
  if (!presetButtons) return;

  const activePreset = isCustom ? 'Custom' : currentPreset.replace('preset', 'Preset ');

  const existingDisplay = document.getElementById('preset-display');
  if (existingDisplay) {
    existingDisplay.textContent = `Current: ${activePreset}`;
  } else {
    const display = document.createElement('span');
    display.id = 'preset-display';
    display.textContent = `Current: ${activePreset}`;
    display.style.marginLeft = '10px';
    display.style.fontWeight = 'bold';
    presetButtons.appendChild(display);
  }
}

function setCustomPreset() {
  if (!isCustom) {
    isCustom = true;
    updatePresetDisplay();
  }
}

function loadPreset(presetName) {
  if (grid) {
    grid.clear();
  }
  grid = new GridContainer('grid-container', 12, 12, setCustomPreset);
  const preset = presets[presetName];

  preset.forEach(widgetData => {
    const widget = new GridWidget(
      widgetData.id,
      widgetData.title,
      widgetData.content,
      widgetData.col,
      widgetData.row,
      widgetData.colSpan,
      widgetData.rowSpan
    );
    grid.addWidget(widget);
  });

  currentPreset = presetName;
  isCustom = false;
  updatePresetDisplay();

  return grid;
}

function initGrid() {
  grid = loadPreset('preset1');

  const preset1Btn = document.getElementById('preset-1');
  const preset2Btn = document.getElementById('preset-2');
  const preset3Btn = document.getElementById('preset-3');

  if (preset1Btn) {
    preset1Btn.addEventListener('click', () => {
      loadPreset('preset1');
    });
  }

  if (preset2Btn) {
    preset2Btn.addEventListener('click', () => {
      loadPreset('preset2');
    });
  }

  if (preset3Btn) {
    preset3Btn.addEventListener('click', () => {
      loadPreset('preset3');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrid);
} else {
  initGrid();
}
