import { view } from "ramda";

export const WAVES_DECIMALS = 8;
export const WAVES_PRECISSION = 1e2;

export const waves = {
    WAVES_SYMBOL: 'WAVES',

    format(amount: number, decimals?: number): number {
        decimals = 10 ** (decimals || WAVES_DECIMALS);
        let value = amount / decimals;

        if (value > 1) {
            return Math.floor(amount / decimals * WAVES_PRECISSION) / WAVES_PRECISSION;
        } else {
            return value;
        }
    },

    amountView(amount: number, decimals?: number): string {
        const value = this.format(amount, decimals);

        return String(Number(value).toFixed(10)).replace(/\.?0+$/,"");
    }
};
