import { libs, serializeCustomData } from '@waves/waves-transactions';
import { base58Encode, blake2b } from '@waves/ts-lib-crypto'

// https://github.com/wavesplatform/ledger-app-waves/wiki/Integration-manual
enum ELederError {
    // SW_OK = '0x9000',
    SW_USER_CANCELLED = '0x9100',
    // SW_SIGN_DATA_NOT_MATCH = '0x9101',
    // SW_DEPRECATED_SIGN_PROTOCOL = '0x9102',
    // SW_INCORRECT_PRECISION_VALUE = '0x9103',
    // SW_INCORRECT_TRANSACTION_TYPE_VERSION = '0x9104',
    // SW_PROTOBUF_DECODING_FAILED = '0x9105',
    // SW_CONDITIONS_NOT_SATISFIED = '0x6985',
    // SW_BUFFER_OVERFLOW = '0x6990',
    // SW_INCORRECT_P1_P2 = '0x6A86',
    // SW_INS_NOT_SUPPORTED = '0x6D00',
    // SW_CLA_NOT_SUPPORTED = ' 0x6E00',
    // SW_SECURITY_STATUS_NOT_SATISFIED = '0x6982',
}

export const isUserCancelError = (code: number) => {
    return parseInt(ELederError.SW_USER_CANCELLED, 16) === code;
};

export const makeLedgerHashFromString = (value: string | number) => {

    let strBytes = libs.crypto.stringToBytes(String(value));
    let base64Encoded = libs.crypto.base64Encode(strBytes);

    let serialized = serializeCustomData({version: 1, binary: base64Encoded});

    const hash = base58Encode(blake2b(serialized));
    console.log(hash);

    return hash;
};
