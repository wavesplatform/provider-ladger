export const WAVES_DECIMALS = 8;

export const waves = {
    WAVES_SYMBOL: 'WAVES',

    format(amount: number, decimals?: number): number {
        if (decimals === undefined) {
            decimals = WAVES_DECIMALS;
        }

        decimals = 10 ** decimals;

        let value = amount / decimals;

        if (value > 1) {
            return amount / decimals;
        } else {
            return value;
        }
    },

    amountView(amount: number, decimals?: number): string {
        const value = this.format(amount, decimals);

        return String(Number(value).toFixed(10)).replace(/\.?0+$/,"");
    }
};
