"use strict";

export default class DefaultClass {
    constructor(params) {
        document.title(params.title);
    }

    async getHTML() {
        return `
            <h1>Default Page</h1>
            <p>Default Page</p>
        `;
    }
}
