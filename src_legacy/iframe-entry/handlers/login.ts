import { IUserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import pipe from 'ramda/es/pipe';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { preload, toQueue } from './helpers';

export const getLoginHandler = (
    queue: Queue,
    state: IState
): (() => Promise<IUserData>) =>
    toQueue(queue, () => {
        preload();
        return login(state)().then((user) => {
            return user;
        });
    });
