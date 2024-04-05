"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const parsedURL = (url) => {
    const parsedUrl = new url_1.URL(url);
    let path = parsedUrl.pathname;
    // Convert forward slashes to backslashes
    path = path.replace(/\//g, "\\");
    // Remove leading backslash
    if (path.startsWith("\\")) {
        path = path.substring(1);
    }
    return path;
};
exports.default = parsedURL;
