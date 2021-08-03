import React from "react";
import ReactDOM from "react-dom";

import { IUser, WavesLedgerSync } from "@waves/ledger";
import {
    ILoginComponentProps,
    ISignTxComponentProps,
    LoginComponent,
    SignTxComponent
} from "./components"
import { PopupContainer } from "./containers";

const LOCALSTORE_KEY = 'pldata-selected-user-id';
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

const renderInContainer = (component: any) => {
    if (opened) {
        return;
    }

    opened = true;

    insureContainer();

    ReactDOM.render(React.createElement<{ onClose: () => void }>(
        PopupContainer,
        { onClose: closeDialog },
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

export const getUser = async (ledger: WavesLedgerSync): Promise<IUser> => {
    const storeValue = localStorage.getItem(LOCALSTORE_KEY);
    let selectedUserId = storeValue ? Number(storeValue) : undefined;

    return new Promise((resolve, reject) => {
        const reactElement = React.createElement<ILoginComponentProps>(LoginComponent, {
            ledger: ledger,
            selectedUserId: selectedUserId,
            onLogin: (user: IUser) => {
                localStorage.setItem(LOCALSTORE_KEY, String(user.id));
                resolve(user);
                closeDialog();
            }
        });

        renderInContainer(reactElement);
    });
}

// export const signTx = async(ledger: WavesLedgerSync, userId: number, tx: any): Promise<any> => {
export const signTx = async(tx: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reactElement = React.createElement<ISignTxComponentProps>(SignTxComponent, {
            // ledger: ledger,
            // userId: userId,
            tx: tx,
            // onSign: () => {
            //     resolve({});
            //     closeDialog();
            // }
        });

        renderInContainer(reactElement);
    });
}
