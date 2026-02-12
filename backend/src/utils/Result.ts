
export class Result<T, E> {
    // Should only be instantiated with success or error static methods
    private constructor(private data: T | null, private error: E | null) { }
    public static success<T, E>(data: T): Result<T, E> {
        return new Result(data, null as E);
    }
    public static error<T, E>(error: E): Result<T, E> {
        return new Result(null as T, error);
    }

    public isError(): boolean {
        return this.error !== null;
    }
    public isSuccess(): boolean {
        return this.error == null;
    }
    public getError(): E {
        if (this.isError()) {
            return this.error as E;
        }
        throw new Error("Cannot get error from a success result");
    }
    public getData(): T {
        if (this.isSuccess()) {
            return this.data as T;
        }
        throw new Error("Cannot get data from an error result Error: \n" + JSON.stringify(this.error, null, 2));
    }
}
