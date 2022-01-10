"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getFeeForExecute = exports.calculateCommonKeys = exports.getEntropyString = exports.hasOwnDeepProperty = exports.getValue = void 0;
function getValue(object, key) {
    var value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = getValue(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}
exports.getValue = getValue;
function hasOwnDeepProperty(obj, prop) {
    if (typeof obj === 'object' && obj !== null) {
        if (obj.hasOwnProperty(prop)) {
            return true;
        }
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && hasOwnDeepProperty(obj[p], prop)) {
                return true;
            }
        }
    }
    return false;
}
exports.hasOwnDeepProperty = hasOwnDeepProperty;
function getEntropyString(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.getEntropyString = getEntropyString;
function calculateCommonKeys(baseKeys, defKeys) {
    if (baseKeys.length === 0 || defKeys.length === 0)
        return [];
    var result = baseKeys.filter(function (key) {
        return defKeys.find(function (k) { return k === key; });
    });
    return result;
}
exports.calculateCommonKeys = calculateCommonKeys;
var gasPriceUscrt = 0.25;
function getFeeForExecute(gas) {
    if (!gas)
        return undefined;
    return {
        amount: [
            {
                amount: String(Math.floor(gas * gasPriceUscrt) + 1),
                denom: 'uscrt',
            },
        ],
        gas: String(gas),
    };
}
exports.getFeeForExecute = getFeeForExecute;
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map