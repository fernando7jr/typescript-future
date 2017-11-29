export interface Future<T> {
    constructor(callback: (resolve, reject) => void);
    cancel(error: any): any;
    wait(result: T): T;
    value(callback: (T) => void): Future<T>;
    catch(callback: (any) => void): Future<T>;
    /* async */ now(): T;
}