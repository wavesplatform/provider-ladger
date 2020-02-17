
export abstract class Adapter {

    public type: string;
    protected _code: number;
    protected _isDestroyed = true;
    protected static _code: number;

    protected constructor(networkCode?: string | number) {
        networkCode = typeof networkCode === 'string' ? networkCode.charCodeAt(0) : networkCode;
        this.type = (this as any).constructor.type;
        this._code = networkCode || Adapter._code || ('W').charCodeAt(0);
    }

    public isAvailable(): Promise<void> {
        return Promise.resolve();
    }

    public onDestroy(cb?: Function): void {
        return;
    }

    public getNetworkByte(): number {
        return this._code || Adapter._code;
    }

    public isDestroyed(): boolean {
        return this._isDestroyed;
    }

    public abstract getSignVersions(): Record<SIGN_TYPE, Array<number>>;

    public abstract getPublicKey(): Promise<string>;

    public abstract getAddress(): Promise<string>;

    public abstract getPrivateKey(): Promise<string>;

    public abstract signRequest(databytes: Uint8Array, signData?: any): Promise<string>;

    public abstract signTransaction(bytes: Uint8Array, amountPrecision: number, signData?: any): Promise<string>;

    public abstract signOrder(bytes: Uint8Array, amountPrecision: number, signData: any): Promise<string>;

    public abstract signData(bytes: Uint8Array): Promise<string>;

    public static initOptions(options: { networkCode: number }) {
        Adapter._code = options.networkCode;
    }

    public static getUserList(): Promise<Array<string>> {
        return Promise.resolve([]);
    }

    public static isAvailable(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export enum SIGN_TYPE {
    AUTH = 1000,
    MATCHER_ORDERS = 1001,
    CREATE_ORDER = 1002,
    CANCEL_ORDER = 1003,
    COINOMAT_CONFIRMATION = 1004,
    WAVES_CONFIRMATION = 1005,
    ISSUE = 3,
    TRANSFER = 4,
    REISSUE = 5,
    BURN = 6,
    EXCHANGE = 7,
    LEASE = 8,
    CANCEL_LEASING = 9,
    CREATE_ALIAS = 10,
    MASS_TRANSFER = 11,
    DATA = 12,
    SET_SCRIPT = 13,
    SPONSORSHIP = 14,
    SET_ASSET_SCRIPT = 15,
    SCRIPT_INVOCATION = 16,
}
