var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Future = /** @class */ (function () {
        function Future(callback) {
            var _this = this;
            this._inited = false;
            this._requested = false;
            this._value = null;
            this._initedError = false;
            this._requestedError = false;
            this._valueError = null;
            this._canceled = false;
            var _resolve = function (result) { _this.wait(result); };
            var _reject = function (result) { _this.cancel(result); };
            try {
                callback(_resolve, _reject);
            }
            catch (err) {
                _reject(err);
            }
        }
        ;
        Future.prototype._resolve = function (result) {
            this._then(result);
            if (this.__interceptThen) {
                this.__interceptThen(result);
            }
        };
        Future.prototype._reject = function (error) {
            this._catch(error);
            if (this.__interceptCatch) {
                this.__interceptCatch(error);
            }
        };
        Future.prototype.cancel = function (error) {
            if (this._canceled)
                return;
            if (this._initedError) {
                this._reject(error);
            }
            else {
                this._requestedError = true;
                this._valueError = error;
            }
            this._canceled = true;
            return error;
        };
        Future.prototype.wait = function (result) {
            if (this._canceled)
                return;
            if (this._inited) {
                this._resolve(result);
            }
            else {
                this._requested = true;
                this._value = result;
            }
            return result;
        };
        Future.prototype.value = function (callback) {
            this._then = callback;
            this._inited = true;
            if (this._requested && !this._inited) {
                this.wait(this._value);
            }
            return this;
        };
        Future.prototype.catch = function (callback) {
            this._catch = callback;
            this._initedError = true;
            if (this._requestedError && !this._initedError) {
                this.cancel(this._valueError);
            }
            return this;
        };
        Future.now = function (callback) {
            return new Future(callback).value(function () {
            }).catch(function () {
            }).now();
        };
        Future.prototype.now = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                if (_this._value)
                                    return resolve(_this._value);
                                var _then = _this.__interceptThen;
                                var _catch = _this.__interceptCatch;
                                _this.__interceptThen = function (result) {
                                    resolve(result);
                                    _this.__interceptThen = _then;
                                    if (_then) {
                                        _then(result);
                                    }
                                };
                                _this.__interceptCatch = function (error) {
                                    reject(error);
                                    _this.__interceptCatch = _catch;
                                    if (_catch) {
                                        _catch(error);
                                    }
                                };
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return Future;
    }());
    exports.Future = Future;
});
