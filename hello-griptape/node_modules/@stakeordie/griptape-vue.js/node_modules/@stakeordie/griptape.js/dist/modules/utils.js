"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = exports.toQueryString = void 0;
function toQueryString(params) {
    return Object.keys(params)
        .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
        .join('&');
}
exports.toQueryString = toQueryString;
function handleResponse(res) {
    return res.data;
}
exports.handleResponse = handleResponse;
//# sourceMappingURL=utils.js.map