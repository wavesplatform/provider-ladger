import React from 'react';
import ReactDOM from 'react-dom';

import { IUser, WavesLedgerSync } from '@waves/ledger';
import {
    IConnectingProps,
    IConnectionErrorProps,
    ILoginComponentProps,
    ISignMessageComponentProps,
    ISignTxComponentProps,
    BrowserNotSupportedComponent,
    ConnectingComponent,
    ConnectionErrorComponent,
    LoginComponent,
    SignMessageComponent,
    SignTxComponent,
} from './components'
import { IPopupContainerProps, PopupContainer } from './containers';

import { EConnectingState } from '../ProviderLedger.interface';

const LSK_LAST_AUTH_USER_ID = 'pldata-auth-user-id';
const LSK_AUTH_USER_LIST = 'pld-auth-user-list'

const CONTAINER_ID = 'plui-container';
let opened = false;

const insureContainer = () => {
    let container = document.getElementById(CONTAINER_ID);

    if(container) {
        // its exist
    } else {
        container = document.createElement('div');
        container.id = CONTAINER_ID;
        document.body.appendChild(container);
    }
}

const renderInContainer = (component: any, hideClose?: boolean) => {
    if (opened) {
        return;
    }

    opened = true;

    insureContainer();

    ReactDOM.render(React.createElement<IPopupContainerProps>(
        PopupContainer,
        {
            onClose: !hideClose ? closeDialog : undefined
        },
        component
    ), document.getElementById(CONTAINER_ID));
}

export const closeDialog = () => {
    if (!opened) {
        return;
    }

    opened = false;

    const container = document.getElementById(CONTAINER_ID);

    if (container) {
        ReactDOM.unmountComponentAtNode(container);
    }
}

export const showBrowserNotSupportedDialog = (): void => {
    renderInContainer(React.createElement(BrowserNotSupportedComponent));
}

export const showGetUserDialog = async (ledger: WavesLedgerSync): Promise<IUser> => {
    const uidSV = localStorage.getItem(LSK_LAST_AUTH_USER_ID);
    const ulistSV = localStorage.getItem(LSK_AUTH_USER_LIST);

    let lastAuthUserId = uidSV ? Number(uidSV) : undefined;
    let authUserList = ulistSV ? JSON.parse(ulistSV) : [];

    return new Promise((resolve, reject) => {
        const reactElement = React.createElement<ILoginComponentProps>(LoginComponent, {
            ledger: ledger,
            lastAuthUserId: lastAuthUserId,
            authUserList: authUserList,
            onLogin: (choosenUser: IUser) => {
                // save user
                if (choosenUser.id !== lastAuthUserId) {
                    localStorage.setItem(LSK_LAST_AUTH_USER_ID, String(choosenUser.id));

                    const isUserInAuthList = authUserList.some((item) => item.id === choosenUser.id);
                    if (!isUserInAuthList) {
                        authUserList.push(choosenUser);
                        localStorage.setItem(LSK_AUTH_USER_LIST, JSON.stringify(authUserList));
                    }
                }

                resolve(choosenUser);
                closeDialog();
            }
        });

        renderInContainer(reactElement);
    });
}

export const showSignTxDialog = (
    tx: any,
    user: IUser,
    assetsDetails: any,
    balance: any,
    onCancel: () => void
): void => {
    const reactElement = React.createElement<ISignTxComponentProps>(SignTxComponent, {
        tx: tx,
        user: user,
        assetsDetails,
        balance: balance,
        onCancel: () => { onCancel(); closeDialog(); }
    });

    renderInContainer(reactElement, true);
}

export const showSignMessageDialog = (
    message: string,
    user: IUser,
    balance: any,
    onCancel: () => void
): void => {
    const reactElement = React.createElement<ISignMessageComponentProps>(SignMessageComponent, {
        message: message,
        user: user,
        balance: balance,
        onCancel: () => { onCancel(); closeDialog(); }
    });

    renderInContainer(reactElement, true);
}

export const showConnectingDialog = (getState: () => EConnectingState) => {
    const reactElement = React.createElement<IConnectingProps>(ConnectingComponent, {
        getState: getState
    });

    renderInContainer(reactElement);
}

export const showConnectionErrorDialog = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reactElement = React.createElement<IConnectionErrorProps>(ConnectionErrorComponent, {
            onReconnect: () => resolve()
        });

        renderInContainer(reactElement);
    });
}
