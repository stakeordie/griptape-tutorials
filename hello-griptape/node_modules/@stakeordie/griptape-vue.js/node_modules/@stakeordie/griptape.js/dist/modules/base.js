"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var BlockchainModule = (function () {
    function BlockchainModule(baseURL) {
        this.client = axios_1.default.create({ baseURL: baseURL });
    }
    return BlockchainModule;
}());
exports.default = BlockchainModule;
//# sourceMappingURL=base.js.map