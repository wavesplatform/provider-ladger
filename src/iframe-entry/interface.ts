import { IUser } from '../interface';

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    matcherUrl?: string | undefined;
}
