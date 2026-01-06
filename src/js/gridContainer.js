"use strict";

export class GridContainer {
  constructor(containerId, columns = 12, rows = 12, onModify = null) {
    this.container = document.getElementById(containerId);
    this.columns = columns;
    this.rows = rows;
    this.widgets = [];
    this.draggingWidget = null;
    this.resizingWidget = null;
    this.placeholder = null;
    this.dragOffset = { x: 0, y: 0 };
    this.initialSize = { colSpan: 0, rowSpan: 0 };
    this.onModify = onModify;

    // Initialize occupancy grid for O(1) collision detection
    this.initializeOccupancyGrid();

    this.setupDragAndDrop();
    this.setupResize();
  }

  /**
   * this function is only to dynamically adjust the column width
   */
  setupGrid() {
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    this.container.style.gap = "10px";
  }

  /**
   * Initialize the occupancy grid for O(1) collision detection
   * Each cell stores the widget ID occupying it, or null if empty
   */
  initializeOccupancyGrid() {
    this.occupancyGrid = Array(this.rows)
      .fill(null)
      .map(() => Array(this.columns).fill(null));
  }

  /**
   * Mark a widget's position in the occupancy grid
   * Time complexity: O(rowSpan × colSpan)
   */
  markWidgetInGrid(widget) {
    for (let r = widget.row - 1; r < widget.row - 1 + widget.rowSpan; r++) {
      for (let c = widget.col - 1; c < widget.col - 1 + widget.colSpan; c++) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
          this.occupancyGrid[r][c] = widget.id;
        }
      }
    }
  }

  /**
   * Clear a widget's position from the occupancy grid
   * Time complexity: O(rowSpan × colSpan)
   */
  clearWidgetFromGrid(widget) {
    for (let r = widget.row - 1; r < widget.row - 1 + widget.rowSpan; r++) {
      for (let c = widget.col - 1; c < widget.col - 1 + widget.colSpan; c++) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
          this.occupancyGrid[r][c] = null;
        }
      }
    }
  }

  /**
   * Check if a position overlaps with any widget using occupancy grid
   * Time complexity: O(rowSpan × colSpan) - much faster than O(n × rowSpan × colSpan)
   * Returns: true if position is free, false if occupied
   */
  isPositionFreeInGrid(col, row, colSpan, rowSpan, excludeWidgetId = null) {
    // Check bounds
    if (
      col < 1 ||
      row < 1 ||
      col + colSpan - 1 > this.columns ||
      row + rowSpan - 1 > this.rows
    ) {
      return false;
    }

    // Check each cell in the occupancy grid
    for (let r = row - 1; r < row - 1 + rowSpan; r++) {
      for (let c = col - 1; c < col - 1 + colSpan; c++) {
        const occupyingWidgetId = this.occupancyGrid[r][c];
        // If cell is occupied by a widget that's not excluded, position is not free
        if (occupyingWidgetId !== null && occupyingWidgetId !== excludeWidgetId) {
          return false;
        }
      }
    }

    return true;
  }

  addWidget(widget) {
    if (
      !this.isValidPosition(
        widget.col,
        widget.row,
        widget.colSpan,
        widget.rowSpan,
      )
    ) {
      throw new Error("Invalid widget position");
    }

    this.widgets.push(widget);
    const widgetEl = widget.create();
    this.container.appendChild(widgetEl);
    
    // Mark widget in occupancy grid
    this.markWidgetInGrid(widget);
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex((w) => w.id === widgetId);
    if (index !== -1) {
      // Clear widget from occupancy grid
      this.clearWidgetFromGrid(this.widgets[index]);
      
      this.widgets[index].element.remove();
      this.widgets.splice(index, 1);
    }
  }

  isValidPosition(col, row, colSpan, rowSpan, excludeWidget = null) {
    if (
      col < 1 ||
      row < 1 ||
      col + colSpan - 1 > this.columns ||
      row + rowSpan - 1 > this.rows
    ) {
      return false;
    }

    for (const widget of this.widgets) {
      if (widget === excludeWidget) continue;

      const widgetEndCol = widget.col + widget.colSpan - 1;
      const widgetEndRow = widget.row + widget.rowSpan - 1;
      const endCol = col + colSpan - 1;
      const endRow = row + rowSpan - 1;

      if (
        !(
          col > widgetEndCol ||
          endCol < widget.col ||
          row > widgetEndRow ||
          endRow < widget.row
        )
      ) {
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

      if (
        !(
          col > widgetEndCol ||
          endCol < widget.col ||
          row > widgetEndRow ||
          endRow < widget.row
        )
      ) {
        displaced.push(widget);
      }
    }

    return displaced;
  }

  findPushPosition(widget, excludedWidgets = new Set()) {
    // Start from the widget's current row and scan downward
    // Within each row, scan left to right
    for (let row = widget.row; row <= this.rows - widget.rowSpan + 1; row++) {
      for (let col = 1; col <= this.columns - widget.colSpan + 1; col++) {
        if (
          this.isValidPositionForPush(
            col,
            row,
            widget.colSpan,
            widget.rowSpan,
            excludedWidgets,
          )
        ) {
          return { col, row };
        }
      }
    }

    return null;
  }

  isValidPositionForPush(col, row, colSpan, rowSpan, excludedWidgets) {
    // Check bounds
    if (
      col < 1 ||
      row < 1 ||
      col + colSpan - 1 > this.columns ||
      row + rowSpan - 1 > this.rows
    ) {
      return false;
    }

    // Use occupancy grid for O(rowSpan × colSpan) checking instead of O(n × rowSpan × colSpan)
    // Convert excluded widgets Set to Set of IDs for faster lookup
    const excludedIds = new Set(
      Array.from(excludedWidgets).map((w) => w.id)
    );

    // Check each cell in the occupancy grid
    for (let r = row - 1; r < row - 1 + rowSpan; r++) {
      for (let c = col - 1; c < col - 1 + colSpan; c++) {
        const occupyingWidgetId = this.occupancyGrid[r][c];
        // If cell is occupied by a widget that's not excluded, position is invalid
        if (occupyingWidgetId !== null && !excludedIds.has(occupyingWidgetId)) {
          return false;
        }
      }
    }

    return true;
  }

  calculatePushPositions(draggingWidget, targetCol, targetRow) {
    const positions = new Map();
    const toProcess = new Set();
    const processed = new Set();

    const displaced = this.findDisplacedWidgets(
      targetCol,
      targetRow,
      draggingWidget.colSpan,
      draggingWidget.rowSpan,
      draggingWidget,
    );
    displaced.forEach((w) => toProcess.add(w));

    const excluded = new Set([draggingWidget, ...displaced]);

    while (toProcess.size > 0) {
      const widget = toProcess.values().next().value;
      toProcess.delete(widget);
      processed.add(widget);

      const newPos = this.findPushPosition(
        widget,
        new Set([draggingWidget, ...processed]),
      );

      if (newPos) {
        positions.set(widget, newPos);

        const newlyDisplaced = this.findDisplacedWidgets(
          newPos.col,
          newPos.row,
          widget.colSpan,
          widget.rowSpan,
        );
        newlyDisplaced.forEach((w) => {
          if (!processed.has(w)) {
            toProcess.add(w);
          }
        });
      }
    }

    return positions;
  }

  setupDragAndDrop() {
    this.container.addEventListener("mousedown", (e) => {
      const dragHandle = e.target.closest(".drag-handle");
      if (!dragHandle) return;

      const widgetEl = e.target.closest(".widget");
      if (!widgetEl) return;

      e.preventDefault();
      this.startDrag(widgetEl, e.clientX, e.clientY);
    });

    this.container.addEventListener(
      "touchstart",
      (e) => {
        const dragHandle = e.target.closest(".drag-handle");
        if (!dragHandle) return;

        const widgetEl = e.target.closest(".widget");
        if (!widgetEl) return;

        e.preventDefault();
        const touch = e.touches[0];
        this.startDrag(widgetEl, touch.clientX, touch.clientY);
      },
      { passive: false },
    );
  }

  startDrag(widgetEl, clientX, clientY) {
    const widget = this.widgets.find((w) => w.id === widgetEl.dataset.widgetId);
    if (!widget) return;

    this.draggingWidget = widget;
    widgetEl.classList.add("dragging");

    // Clear widget from occupancy grid while dragging
    this.clearWidgetFromGrid(widget);

    const rect = widgetEl.getBoundingClientRect();
    this.dragOffset.x = clientX - rect.left;
    this.dragOffset.y = clientY - rect.top;

    this.createPlaceholder(widget);

    const containerRect = this.container.getBoundingClientRect();
    widgetEl.style.position = "fixed";
    widgetEl.style.left = `${clientX - this.dragOffset.x}px`;
    widgetEl.style.top = `${clientY - this.dragOffset.y}px`;
    widgetEl.style.zIndex = "1000";

    this.setupDragListeners();
  }

  createPlaceholder(widget) {
    if (this.placeholder) this.placeholder.remove();

    this.placeholder = document.createElement("div");
    this.placeholder.className = "widget placeholder";
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
      widgetEl.classList.remove("dragging");
      widgetEl.style.position = "";
      widgetEl.style.left = "";
      widgetEl.style.top = "";
      widgetEl.style.zIndex = "";

      const placeholderCol = parseInt(
        window.getComputedStyle(this.placeholder).gridColumnStart,
      );
      const placeholderRow = parseInt(
        window.getComputedStyle(this.placeholder).gridRowStart,
      );

      console.log('=== DROP EVENT ===');
      console.log('Dragged widget:', this.draggingWidget.id, 'should go to', placeholderCol, placeholderRow);
      console.log('Dragged widget current pos:', this.draggingWidget.col, this.draggingWidget.row);

      // Calculate push positions at drop time
      const pushPositions = this.calculatePushPositions(
        this.draggingWidget,
        placeholderCol,
        placeholderRow,
      );

      console.log('Push positions calculated:', pushPositions.size);
      pushPositions.forEach((pos, widget) => {
        console.log('  -', widget.id, 'will move from', widget.col, widget.row, 'to', pos.col, pos.row);
      });

      // Update dragged widget to placeholder position
      console.log('Updating dragged widget to:', placeholderCol, placeholderRow);
      this.draggingWidget.updatePosition(placeholderCol, placeholderRow);
      this.markWidgetInGrid(this.draggingWidget);
      console.log('Dragged widget now at:', this.draggingWidget.col, this.draggingWidget.row);

      // Push all displaced widgets
      pushPositions.forEach((pos, widget) => {
        console.log('Moving', widget.id, 'to', pos.col, pos.row);
        this.clearWidgetFromGrid(widget);
        widget.updatePosition(pos.col, pos.row);
        this.markWidgetInGrid(widget);
        console.log('  -', widget.id, 'now at:', widget.col, widget.row);
      });

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

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    const cleanup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
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

    col = Math.max(
      1,
      Math.min(this.columns - this.draggingWidget.colSpan + 1, col),
    );
    row = Math.max(
      1,
      Math.min(this.rows - this.draggingWidget.rowSpan + 1, row),
    );

    this.placeholder.style.gridColumn = `${col} / span ${this.draggingWidget.colSpan}`;
    this.placeholder.style.gridRow = `${row} / span ${this.draggingWidget.rowSpan}`;

    // Don't actually move widgets during drag - just show placeholder
    // Push logic will be applied on drop
  }

  setupResize() {
    this.container.addEventListener("mousedown", (e) => {
      const resizeHandle = e.target.closest(".resize-handle");
      if (!resizeHandle) return;

      const widgetEl = e.target.closest(".widget");
      if (!widgetEl) return;

      e.preventDefault();
      e.stopPropagation();
      this.startResize(widgetEl, e.clientX, e.clientY);
    });

    this.container.addEventListener(
      "touchstart",
      (e) => {
        const resizeHandle = e.target.closest(".resize-handle");
        if (!resizeHandle) return;

        const widgetEl = e.target.closest(".widget");
        if (!widgetEl) return;

        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        this.startResize(widgetEl, touch.clientX, touch.clientY);
      },
      { passive: false },
    );
  }

  startResize(widgetEl, clientX, clientY) {
    const widget = this.widgets.find((w) => w.id === widgetEl.dataset.widgetId);
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
        Math.min(
          this.columns - this.resizingWidget.col + 1,
          this.initialSize.colSpan + deltaCol,
        ),
      );
      const newRowSpan = Math.max(
        1,
        Math.min(
          this.rows - this.resizingWidget.row + 1,
          this.initialSize.rowSpan + deltaRow,
        ),
      );

      if (
        this.isValidPosition(
          this.resizingWidget.col,
          this.resizingWidget.row,
          newColSpan,
          newRowSpan,
          this.resizingWidget,
        )
      ) {
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

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    const cleanup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }

  toJSON() {
    return {
      columns: this.columns,
      rows: this.rows,
      widgets: this.widgets.map((w) => w.toJSON()),
    };
  }

  fromJSON(data) {
    this.container.innerHTML = "";
    this.widgets = [];

    data.widgets.forEach((widgetData) => {
      const widget = GridWidget.fromJSON(widgetData);
      this.addWidget(widget);
    });
  }

  clear() {
    this.container.innerHTML = "";
    this.widgets = [];
    this.initializeOccupancyGrid();
  }
}
