"use strict";

export default class DefaultClass {
    constructor(page) {
        this.page = page;
    }

    async getHTML() {
        // have to await the fetch, and then chain it to convert response to text
        const contentHTML = await fetch("/pages/${this.page}/${this.page}.html")
            .then((response) => response.text())
            .catch((err) => console.log(err));
        return contentHTML;
    }
}
