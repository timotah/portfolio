"use strict";

export default class DefaultClass {
    constructor(page) {
        this.page = page;
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

    moveElement(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let dragElement = null;

        element.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);

        function startDrag(event) {
            dragElement = element;
            element.style.position = "absolute";
            element.style.cursor = "grabbing";
            // mouse offset relative to the element
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;
        }

        // offset is the difference between the mouse position and the element position top and left
        function drag(event) {
            if (dragElement) {
                // get position of the mouse
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                // subtract the offset of the mouse relative to the element, to keep mouse in same position
                // element.style.left = mouseX - offsetX + "px";
                element.style.top = mouseY - offsetY + "px";

                // Get the bounds of the window
                // const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Get the bounds of the element
                // const elementWidth = element.offsetWidth;
                const elementHeight = element.offsetHeight;

                // Calculate the maximum allowed position for the element
                // const maxX = windowWidth - elementWidth;
                const maxY = windowHeight - elementHeight;

                // Ensure the element stays within the bounds of the window
                // if (mouseX - offsetX < 0) {
                //     element.style.left = "0px";
                // } else if (mouseX - offsetX > maxX) {
                //     element.style.left = maxX + "px";
                // }

                if (mouseY - offsetY < 0) {
                    element.style.top = "0px";
                } else if (mouseY - offsetY > maxY) {
                    element.style.top = maxY + "px";
                }
            }
        }

        function endDrag() {
            dragElement = null;
            element.style.cursor = "grab";
        }

        function getElementCoordinates(element) {
            const rect = element.getBoundingClientRect();
            const mouseX = rect.left;
            const mouseY = rect.top;
            return [mouseX, mouseY];
        }
    }
}
