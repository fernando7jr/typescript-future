export class Future<T> {
    private _then;
    private _catch;
    private _inited: boolean = false;
    private _requested: boolean = false;
    private _value: T = null;
    private _initedError: boolean = false;
    private _requestedError: boolean = false;
    private _valueError: any = null;
    private _canceled: boolean = false;
    constructor(callback: (resolve, reject) => void) {
        const _resolve = (result: T) => { this.wait(result); };
        const _reject = (result: any) => { this.cancel(result); };
        try {
            callback(_resolve, _reject);
        } catch (err) {
            _reject(err);
        }
        
    };

    public cancel(error: any): any {
        if (this._canceled)
            return;
        if (this._initedError) {
            this._catch(error);
        } else {
            this._requestedError = true;
            this._valueError = error;
        }
        this._canceled = true;
        return error;
    }

    public wait(result: T): T {
        if (this._canceled)
            return;
        if (this._inited) {
            this._then(result);
        } else {
            this._requested = true;
            this._value = result;
        }
        return result;
    }

    public value(callback: (T) => void): Future<T> {
        this._then = callback;
        this._inited = true;
        if (this._requested && !this._inited) {
            this.wait(this._value);
        }
        return this;
    }

    public catch(callback: (any) => void): Future<T> {
        this._catch = callback;
        this._initedError = true;
        if (this._requestedError && !this._initedError) {
            this.cancel(this._valueError);
        }
        return this;
    }
}