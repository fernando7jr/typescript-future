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
        Future.prototype.cancel = function (error) {
            if (this._canceled)
                return;
            if (this._initedError) {
                this._catch(error);
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
                this._then(result);
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
        return Future;
    }());
    exports.Future = Future;
});
