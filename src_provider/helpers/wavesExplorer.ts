import { ENetworkCode } from '../interface';

const getExplorerUrl = (code: ENetworkCode) => {
    switch (code) {
        case ENetworkCode.MAINNET: return 'https://wavesexplorer.com';
        case ENetworkCode.STAGENET: return 'https://stagenet.wavesexplorer.com';
        case ENetworkCode.TESTNET: return 'https://testnet.wavesexplorer.com';
    }
};

export const getAssetInfoUrl = (network: ENetworkCode, assetId: string) => {
    const explorerUrl = getExplorerUrl(network);

    return `${explorerUrl}/assets/${assetId}`;
}
