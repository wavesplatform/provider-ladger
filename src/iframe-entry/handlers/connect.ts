import { IConnectOptions } from '@waves/signer';
import { IState } from '../interface';

export function getConnectHandler(
    state: IState
): (options: IConnectOptions) => void {
    return (options): void => {
        state.networkByte = options.NETWORK_BYTE;
        state.nodeUrl = options.NODE_URL;
        state.networkByte = options.NETWORK_BYTE;

        // analytics.addApi({
        //     apiToken:
        //         state.networkByte === 87
        //             ? '1b7892a92d0e56a667df25583600fff3'
        //             : 'ca96b9de2a3dd00b62ec70f7ef6ffb3e',
        //     libraryUrl: 'https://waves.exchange/amplitude.js', // TODO Still don't know how to use shared files like this
        //     initializeMethod: 'amplitudeInit',
        //     sendMethod: 'amplitudePushEvent',
        //     type: 'logic',
        // });
        //
        // analytics.addApi({
        //     apiToken:
        //         state.networkByte === 87 ? 'UA-154392329-1' : 'UA-154392329-2',
        //     libraryUrl: 'https://waves.exchange/googleAnalytics.js', // TODO ???
        //     initializeMethod: 'gaInit',
        //     sendMethod: 'gaPushEvent',
        //     type: 'ui',
        // });
        //
        // analytics.init({
        //     platform: 'web',
        //     userType: 'unknown',
        //     referrer: document.referrer,
        // });
        //
        // analytics.activate();
        //
        // analytics.send({
        //     name: 'Signer_Connect',
        //     params: {
        //         Network_Byte: options.NETWORK_BYTE, // eslint-disable-line @typescript-eslint/camelcase
        //         Node_Url: options.NODE_URL, // eslint-disable-line @typescript-eslint/camelcase
        //     },
        // });
    };
}
