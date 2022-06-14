import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import { IBusEvents, TBusHandlers } from '../interface';
import { Queue } from '../utils/Queue';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { IState } from './interface';
import { getSignHandler } from './handlers/sign';

config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
const queue = new Queue(3);

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            matcherUrl: undefined,
        };

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));

        // bus.registerRequestHandler('sign', getSignHandler(queue, state));
        bus.registerRequestHandler('sign', getSignHandler(queue, state));


        bus.dispatchEvent('ready', void 0);

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
