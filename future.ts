export class Future<T> {
    private _then;
    private __interceptThen;
    private _catch;
    private __interceptCatch;
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

    private _resolve(result: T): void {
        this._then(result);
        if (this.__interceptThen) {
            this.__interceptThen(result);
        }
    }

    private _reject(error: any): void {
        this._catch(error);
        if (this.__interceptCatch) {
            this.__interceptCatch(error);
        }
    }

    public cancel(error: any): any {
        if (this._canceled)
            return;
        if (this._initedError) {
            this._reject(error);
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
            this._resolve(result);
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

    public static now<T>(callback: (resolve, reject) => void): Promise<T> {
        return new Future<T>(callback).value(() => {

        }).catch(() => {

        }).now();
    }

    public async now(): Promise<T> {
        return await new Promise<T>((resolve, reject) => {
            if (this._value)
                return resolve(this._value);
            const _then = this.__interceptThen;
            const _catch = this.__interceptCatch;
            this.__interceptThen = (result) => {
                resolve(result);
                this.__interceptThen = _then;
                if (_then) {
                    _then(result);
                }
            }
            this.__interceptCatch = (error) => {
                reject(error);
                this.__interceptCatch = _catch;
                if (_catch) {
                    _catch(error);
                }
            }
        });
    }
}