"use strict";
import DefaultClass from "/js/DefaultClass.js";

export default class Home extends DefaultClass {
    constructor(router) {
        super("home", router);
        this.drawCircle();
        this.fileCabinet();
    }

    fileCabinet() {
        const fileCabinet = document.getElementById("myCanvas");
        console.log("element", fileCabinet);
        // add the offsets of the relative drawer-wrapper
        this.moveElement(fileCabinet, 0, 0);
    }

    toProjects() {
        console.log(this.router);
        this.router.navigateTo("/projects");
    }

    toContactMe() {
        this.router.navigateTo("/contactme");
    }

    toResume() {
        this.router.navigateTo("/resume");
    }

    fileCabinetBounds() {
        // there will always be 3 objects, one top,
    }

    drawCircle() {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");

        // Draw the file cabinet
        ctx.fillStyle = "#ccc";
        ctx.fillRect(20, 20, 260, 360);

        // Add shadow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

        // Draw the top border
        ctx.fillStyle = "#aaa";
        ctx.fillRect(20, 20, 260, 10);

        // Draw the drawers
        ctx.fillStyle = "#999";
        ctx.fillRect(30, 30, 240, 50);
        ctx.fillRect(30, 90, 240, 50);
        ctx.fillRect(30, 150, 240, 50);
        ctx.fillRect(30, 210, 240, 50);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Add handles to the drawers
        ctx.fillStyle = "#444";
        ctx.beginPath();
        ctx.arc(280, 55, 10, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(280, 115, 10, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(280, 175, 10, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(280, 235, 10, 0, 2 * Math.PI);
        ctx.fill();

        // Add labels to the drawers
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText("Drawer 1", 40, 70);
        ctx.fillText("Drawer 2", 40, 130);
        ctx.fillText("Drawer 3", 40, 190);
        ctx.fillText("Drawer 4", 40, 250);
    }
}
