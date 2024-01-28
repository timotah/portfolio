"use strict";

export default class DefaultClass {
    constructor(page, router) {
        // bad OOO but its so clean and easy to use
        this.page = page;
        this.router = router;
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

    // the relativeX and relativeY are the offsets from the top left/right of parent element that will reset it to 0
    moveElement(element, relativeX, relativeY) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let dragElement = null;

        element.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);

        function startDrag(event) {
            dragElement = element;
            element.style.cursor = "grabbing";
            // mouse offset relative to the element
            offsetX = event.clientX - element.getBoundingClientRect().left;
            // want the offset not to be
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

                // this 254 is from top of screen, to top of wrapper, need to acct for that offset
                // that is between the relative element and the screen
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

                if (mouseY - offsetY > maxY) {
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

    navigateTo(urlSegs) {
        router.navigateTo(urlSegs);
    }
}
