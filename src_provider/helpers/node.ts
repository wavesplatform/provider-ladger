import { ENetworkCode } from '../interface';

export const getNodeBaseUrl = (code: ENetworkCode) => {
    switch (code) {
        case ENetworkCode.MAINNET: return 'https://nodes.wavesplatform.com';
        case ENetworkCode.STAGENET: return 'https://nodes-stagenet.wavesnodes.com';
        case ENetworkCode.TESTNET: return 'https://nodes-testnet.wavesnodes.com';
    }
};

// IDE
// export const NETWORKS = {
//     STAGENET: {
//         url: 'https://nodes-stagenet.wavesnodes.com',
//         chainId: 'S',
//         faucet: 'https://wavesexplorer.com/stagenet/faucet',
//         explorer: 'https://wavesexplorer.com/stagenet'
//     },
//     TESTNET: {
//         url: 'https://nodes-testnet.wavesnodes.com',
//         chainId: 'T',
//         faucet: 'https://wavesexplorer.com/testnet/faucet',
//         explorer: 'https://wavesexplorer.com/testnet'
//     },
//     MAINNET: {
//         url: 'https://nodes.wavesplatform.com',
//         chainId: 'W',
//         explorer: 'https://wavesexplorer.com'
//     }
// };
