import { fetchBalance, fetchScriptInfo, } from '@waves/node-api-js/es/api-node/addresses';
import { fetchByAddress } from '@waves/node-api-js/es/api-node/alias';
import { TLong } from '@waves/signer';
import { storage } from './storage';

export function hasAccount(): boolean {
    return storage.hasUserId();
}

export function isTermsAccepted(): boolean {
    return storage.get('termsAccepted');
}

export function saveTerms(accepted: boolean): void {
    return storage.set('termsAccepted', accepted);
}

export function fetchAliasses(
    base: string,
    address: string
): Promise<Array<string>> {
    return fetchByAddress(base, address);
}

export function fetchWavesBalance(
    base: string,
    address: string
): Promise<TLong> {
    return fetchBalance(base, address).then((info) => info.balance);
}

export function fetchAddressHasScript(
    base: string,
    address: string
): Promise<boolean> {
    return fetchScriptInfo(base, address)
        .then((info) => info.extraFee !== 0)
        .catch(() => false);
}
