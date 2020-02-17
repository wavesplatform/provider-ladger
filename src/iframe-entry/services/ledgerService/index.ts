import { default as TransportU2F } from '@ledgerhq/hw-transport-u2f';
import { LedgerAdapter } from './LedgerAdapter';

class LedgerService {
    adapter = LedgerAdapter;
    instance: LedgerAdapter | null = null;
    userList: any[] = [];

    constructor() {
        this.init();
    }

    init = () => {
        LedgerAdapter.initOptions({
            networkCode: 84,
            debug: false,
            transport: TransportU2F,
            openTimeout: 3000,
            listenTimeout: 25000,
            exchangeTimeout: 100000
        });

        LedgerAdapter.getUserList(0, 0)
            .then(([userData]: any) => {
                this.userList = userData;
                console.log(userData);
            })
            .then(() => {
                this.instance = new LedgerAdapter(this.userList);
                console.log('ledger installed successfully');
            })
            .catch((e: any) => console.log('fail: ', e));
    };

    get isConnected(): boolean {
        return this.adapter.isAvailable() && this.instance != null;
    }

}

const ledgerService = new LedgerService();

export default ledgerService;
