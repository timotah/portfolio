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
    const widget = document.createElement("div");
    widget.className = "widget";
    widget.dataset.widgetId = this.id;
    widget.style.gridColumn = `${this.col} / span ${this.colSpan}`;
    widget.style.gridRow = `${this.row} / span ${this.rowSpan}`;

    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";

    const content = document.createElement("div");
    content.className = "widget-content";
    content.innerHTML = this.content;

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";

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
      rowSpan: this.rowSpan,
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
      data.rowSpan,
    );
  }
}
