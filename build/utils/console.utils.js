"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleUtils = void 0;
class ConsoleUtils {
    constructor(prefix) {
        this.prefix = prefix;
    }
    logSeparacao() {
        this.log('--------------------------------------------------------------');
    }
    log(log) {
        console.log(`[${this.prefix}] ` + log);
    }
}
exports.ConsoleUtils = ConsoleUtils;
