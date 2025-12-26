"use strict";

export class GridWidget {
  constructor(id, title, content, col = 1, row = 1, colSpan = 3, rowSpan = 3) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.col = col;
    this.row = row;
    this.colSpan = colSpan;
    this.rowSpan = rowSpan;
    this.element = null;
  }

  create() {
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.dataset.widgetId = this.id;
    widget.style.gridColumn = `${this.col} / span ${this.colSpan}`;
    widget.style.gridRow = `${this.row} / span ${this.rowSpan}`;

    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';

    const content = document.createElement('div');
    content.className = 'widget-content';
    content.innerHTML = this.content;

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';

    widget.appendChild(dragHandle);
    widget.appendChild(content);
    widget.appendChild(resizeHandle);

    this.element = widget;
    return widget;
  }

  updatePosition(col, row) {
    this.col = col;
    this.row = row;
    if (this.element) {
      this.element.style.gridColumn = `${this.col} / span ${this.colSpan}`;
      this.element.style.gridRow = `${this.row} / span ${this.rowSpan}`;
    }
  }

  updateSize(colSpan, rowSpan) {
    this.colSpan = colSpan;
    this.rowSpan = rowSpan;
    if (this.element) {
      this.element.style.gridColumn = `${this.col} / span ${this.colSpan}`;
      this.element.style.gridRow = `${this.row} / span ${this.rowSpan}`;
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      col: this.col,
      row: this.row,
      colSpan: this.colSpan,
      rowSpan: this.rowSpan
    };
  }

  static fromJSON(data) {
    return new GridWidget(
      data.id,
      data.title,
      data.content,
      data.col,
      data.row,
      data.colSpan,
      data.rowSpan
    );
  }
}

export class GridSystem {
  constructor(containerId, columns = 12, rows = 12, onModify = null) {
    this.container = document.getElementById(containerId);
    this.columns = columns;
    this.rows = rows;
    this.widgets = [];
    this.draggingWidget = null;
    this.resizingWidget = null;
    this.placeholder = null;
    this.tempPositions = new Map();
    this.dragOffset = { x: 0, y: 0 };
    this.initialSize = { colSpan: 0, rowSpan: 0 };
    this.onModify = onModify;

    this.setupGrid();
    this.setupDragAndDrop();
    this.setupResize();
  }

  setupGrid() {
    this.container.style.display = 'grid';
    this.container.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    this.container.style.gap = '10px';
  }

  addWidget(widget) {
    if (!this.isValidPosition(widget.col, widget.row, widget.colSpan, widget.rowSpan)) {
      throw new Error('Invalid widget position');
    }

    this.widgets.push(widget);
    const widgetEl = widget.create();
    this.container.appendChild(widgetEl);
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.widgets[index].element.remove();
      this.widgets.splice(index, 1);
    }
  }

  isValidPosition(col, row, colSpan, rowSpan, excludeWidget = null) {
    if (col < 1 || row < 1 || col + colSpan - 1 > this.columns || row + rowSpan - 1 > this.rows) {
      return false;
    }

    for (const widget of this.widgets) {
      if (widget === excludeWidget) continue;

      const widgetEndCol = widget.col + widget.colSpan - 1;
      const widgetEndRow = widget.row + widget.rowSpan - 1;
      const endCol = col + colSpan - 1;
      const endRow = row + rowSpan - 1;

      if (!(col > widgetEndCol || endCol < widget.col || row > widgetEndRow || endRow < widget.row)) {
        return false;
      }
    }

    return true;
  }

  findValidPosition(col, row, colSpan, rowSpan, excludeWidget = null) {
    for (let r = 1; r <= this.rows - rowSpan + 1; r++) {
      for (let c = 1; c <= this.columns - colSpan + 1; c++) {
        if (this.isValidPosition(c, r, colSpan, rowSpan, excludeWidget)) {
          return { col: c, row: r };
        }
      }
    }
    return null;
  }

  findDisplacedWidgets(col, row, colSpan, rowSpan, excludeWidget = null) {
    const displaced = [];
    const endCol = col + colSpan - 1;
    const endRow = row + rowSpan - 1;

    for (const widget of this.widgets) {
      if (widget === excludeWidget) continue;

      const widgetEndCol = widget.col + widget.colSpan - 1;
      const widgetEndRow = widget.row + widget.rowSpan - 1;

      if (!(col > widgetEndCol || endCol < widget.col || row > widgetEndRow || endRow < widget.row)) {
        displaced.push(widget);
      }
    }

    return displaced;
  }

  findPushPosition(widget, excludedWidgets = new Set()) {
    let col = widget.col;
    let row = widget.row;

    while (row <= this.rows - widget.rowSpan + 1) {
      while (col <= this.columns - widget.colSpan + 1) {
        if (this.isValidPositionForPush(col, row, widget.colSpan, widget.rowSpan, excludedWidgets)) {
          return { col, row };
        }
        col++;
      }
      col = 1;
      row++;
    }

    return null;
  }

  isValidPositionForPush(col, row, colSpan, rowSpan, excludedWidgets) {
    if (col < 1 || row < 1 || col + colSpan - 1 > this.columns || row + rowSpan - 1 > this.rows) {
      return false;
    }

    for (const widget of this.widgets) {
      if (excludedWidgets.has(widget)) continue;

      const widgetEndCol = widget.col + widget.colSpan - 1;
      const widgetEndRow = widget.row + widget.rowSpan - 1;
      const endCol = col + colSpan - 1;
      const endRow = row + rowSpan - 1;

      if (!(col > widgetEndCol || endCol < widget.col || row > widgetEndRow || endRow < widget.row)) {
        return false;
      }
    }

    return true;
  }

  calculatePushPositions(draggingWidget, targetCol, targetRow) {
    const positions = new Map();
    const toProcess = new Set();
    const processed = new Set();

    const displaced = this.findDisplacedWidgets(targetCol, targetRow, draggingWidget.colSpan, draggingWidget.rowSpan);
    displaced.forEach(w => toProcess.add(w));

    const excluded = new Set([draggingWidget, ...displaced]);

    while (toProcess.size > 0) {
      const widget = toProcess.values().next().value;
      toProcess.delete(widget);
      processed.add(widget);

      const newPos = this.findPushPosition(widget, new Set([draggingWidget, ...processed]));

      if (newPos) {
        positions.set(widget, newPos);

        const newlyDisplaced = this.findDisplacedWidgets(newPos.col, newPos.row, widget.colSpan, widget.rowSpan);
        newlyDisplaced.forEach(w => {
          if (!processed.has(w)) {
            toProcess.add(w);
          }
        });
      }
    }

    return positions;
  }

  setupDragAndDrop() {
    this.container.addEventListener('mousedown', (e) => {
      const dragHandle = e.target.closest('.drag-handle');
      if (!dragHandle) return;

      const widgetEl = e.target.closest('.widget');
      if (!widgetEl) return;

      e.preventDefault();
      this.startDrag(widgetEl, e.clientX, e.clientY);
    });

    this.container.addEventListener('touchstart', (e) => {
      const dragHandle = e.target.closest('.drag-handle');
      if (!dragHandle) return;

      const widgetEl = e.target.closest('.widget');
      if (!widgetEl) return;

      e.preventDefault();
      const touch = e.touches[0];
      this.startDrag(widgetEl, touch.clientX, touch.clientY);
    }, { passive: false });
  }

  startDrag(widgetEl, clientX, clientY) {
    const widget = this.widgets.find(w => w.id === widgetEl.dataset.widgetId);
    if (!widget) return;

    this.draggingWidget = widget;
    widgetEl.classList.add('dragging');

    const rect = widgetEl.getBoundingClientRect();
    this.dragOffset.x = clientX - rect.left;
    this.dragOffset.y = clientY - rect.top;

    this.createPlaceholder(widget);

    const containerRect = this.container.getBoundingClientRect();
    widgetEl.style.position = 'fixed';
    widgetEl.style.left = `${clientX - this.dragOffset.x}px`;
    widgetEl.style.top = `${clientY - this.dragOffset.y}px`;
    widgetEl.style.zIndex = '1000';

    this.setupDragListeners();
  }

  createPlaceholder(widget) {
    if (this.placeholder) this.placeholder.remove();

    this.placeholder = document.createElement('div');
    this.placeholder.className = 'widget placeholder';
    this.placeholder.style.gridColumn = `${widget.col} / span ${widget.colSpan}`;
    this.placeholder.style.gridRow = `${widget.row} / span ${widget.rowSpan}`;
    this.container.insertBefore(this.placeholder, widget.element);
  }

  setupDragListeners() {
    const onMove = (clientX, clientY) => {
      if (!this.draggingWidget) return;

      const widgetEl = this.draggingWidget.element;
      widgetEl.style.left = `${clientX - this.dragOffset.x}px`;
      widgetEl.style.top = `${clientY - this.dragOffset.y}px`;

      this.updatePlaceholder(clientX, clientY);
    };

    const onEnd = () => {
      if (!this.draggingWidget) return;

      const widgetEl = this.draggingWidget.element;
      widgetEl.classList.remove('dragging');
      widgetEl.style.position = '';
      widgetEl.style.left = '';
      widgetEl.style.top = '';
      widgetEl.style.zIndex = '';

      const placeholderCol = parseInt(
        window.getComputedStyle(this.placeholder).gridColumnStart
      );
      const placeholderRow = parseInt(
        window.getComputedStyle(this.placeholder).gridRowStart
      );

      this.draggingWidget.updatePosition(placeholderCol, placeholderRow);

      this.tempPositions.forEach((pos, widget) => {
        widget.updatePosition(pos.col, pos.row);
        widget.element.style.opacity = '1';
      });
      this.tempPositions.clear();

      if (this.placeholder) {
        this.placeholder.remove();
        this.placeholder = null;
      }

      this.draggingWidget = null;
      if (this.onModify) this.onModify();
      cleanup();
    };

    const onMouseMove = (e) => onMove(e.clientX, e.clientY);
    const onMouseUp = () => onEnd();

    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => onEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }

  updatePlaceholder(clientX, clientY) {
    const containerRect = this.container.getBoundingClientRect();
    const cellWidth = containerRect.width / this.columns;
    const cellHeight = containerRect.height / this.rows;

    const relativeX = clientX - containerRect.left;
    const relativeY = clientY - containerRect.top;

    let col = Math.floor(relativeX / cellWidth) + 1;
    let row = Math.floor(relativeY / cellHeight) + 1;

    col = Math.max(1, Math.min(this.columns - this.draggingWidget.colSpan + 1, col));
    row = Math.max(1, Math.min(this.rows - this.draggingWidget.rowSpan + 1, row));

    this.placeholder.style.gridColumn = `${col} / span ${this.draggingWidget.colSpan}`;
    this.placeholder.style.gridRow = `${row} / span ${this.draggingWidget.rowSpan}`;

    const pushPositions = this.calculatePushPositions(this.draggingWidget, col, row);
    this.tempPositions = pushPositions;

    pushPositions.forEach((pos, widget) => {
      widget.element.style.gridColumn = `${pos.col} / span ${widget.colSpan}`;
      widget.element.style.gridRow = `${pos.row} / span ${widget.rowSpan}`;
      widget.element.style.opacity = '0.5';
    });
  }

  setupResize() {
    this.container.addEventListener('mousedown', (e) => {
      const resizeHandle = e.target.closest('.resize-handle');
      if (!resizeHandle) return;

      const widgetEl = e.target.closest('.widget');
      if (!widgetEl) return;

      e.preventDefault();
      e.stopPropagation();
      this.startResize(widgetEl, e.clientX, e.clientY);
    });

    this.container.addEventListener('touchstart', (e) => {
      const resizeHandle = e.target.closest('.resize-handle');
      if (!resizeHandle) return;

      const widgetEl = e.target.closest('.widget');
      if (!widgetEl) return;

      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      this.startResize(widgetEl, touch.clientX, touch.clientY);
    }, { passive: false });
  }

  startResize(widgetEl, clientX, clientY) {
    const widget = this.widgets.find(w => w.id === widgetEl.dataset.widgetId);
    if (!widget) return;

    this.resizingWidget = widget;
    this.initialSize = { colSpan: widget.colSpan, rowSpan: widget.rowSpan };
    this.initialPosition = { x: clientX, y: clientY };

    this.setupResizeListeners();
  }

  setupResizeListeners() {
    const onMove = (clientX, clientY) => {
      if (!this.resizingWidget) return;

      const containerRect = this.container.getBoundingClientRect();
      const cellWidth = containerRect.width / this.columns;
      const cellHeight = containerRect.height / this.rows;

      const deltaX = clientX - this.initialPosition.x;
      const deltaY = clientY - this.initialPosition.y;

      const deltaCol = Math.round(deltaX / cellWidth);
      const deltaRow = Math.round(deltaY / cellHeight);

      const newColSpan = Math.max(
        1,
        Math.min(this.columns - this.resizingWidget.col + 1, this.initialSize.colSpan + deltaCol)
      );
      const newRowSpan = Math.max(
        1,
        Math.min(this.rows - this.resizingWidget.row + 1, this.initialSize.rowSpan + deltaRow)
      );

      if (this.isValidPosition(
        this.resizingWidget.col,
        this.resizingWidget.row,
        newColSpan,
        newRowSpan,
        this.resizingWidget
      )) {
        this.resizingWidget.updateSize(newColSpan, newRowSpan);
      }
    };

    const onEnd = () => {
      this.resizingWidget = null;
      this.initialSize = { colSpan: 0, rowSpan: 0 };
      if (this.onModify) this.onModify();
      cleanup();
    };

    const onMouseMove = (e) => onMove(e.clientX, e.clientY);
    const onMouseUp = () => onEnd();

    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => onEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }

  toJSON() {
    return {
      columns: this.columns,
      rows: this.rows,
      widgets: this.widgets.map(w => w.toJSON())
    };
  }

  fromJSON(data) {
    this.container.innerHTML = '';
    this.widgets = [];

    data.widgets.forEach(widgetData => {
      const widget = GridWidget.fromJSON(widgetData);
      this.addWidget(widget);
    });
  }

  clear() {
    this.container.innerHTML = '';
    this.widgets = [];
  }
}

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
  grid = new GridSystem('grid-container', 12, 12, setCustomPreset);
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
