import { ENetworkCode } from '../interface';

export const getUrl = (code: ENetworkCode) => {
    switch (code) {
        case ENetworkCode.MAINNET: return 'https://wavesexplorer.com';
        case ENetworkCode.STAGENET: return 'https://stagenet.wavesexplorer.com';
        case ENetworkCode.TESTNET: return 'https://testnet.wavesexplorer.com';
    }
};

export const getAssetInfoUrl = (network: ENetworkCode, assetId: string) => {
    const networkUrl = getUrl(network);

    return `${networkUrl}/assets/${assetId}`;
}
