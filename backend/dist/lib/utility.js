"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = void 0;
const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
exports.escapeRegex = escapeRegex;
