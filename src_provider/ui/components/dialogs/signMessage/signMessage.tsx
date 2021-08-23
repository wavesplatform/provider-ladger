import React from 'react';
import { IUser } from '@waves/ledger';

import { waves } from '../../../../helpers';

import {
    Box,
    Button,
    Tabs,
    Text,
    SvgTxInvokeScriptLogo,
    SvgLedgerLogoConfirm,
} from '../../../ui-kit'; // todo ui-kit

import { UserComponent } from '../../user';

import styles from './styles.less'

enum ESignTab {
    MAIN = 'Main',
    // DETAILS = 'Details',
    // JSON = 'JSON',
}

export interface ISignMessageComponentProps {
    balance?: any;
    message: string;
    user: IUser;
    onCancel: () => void;
};

interface ISignMessageComponentState {
    selectedTab: ESignTab
};

export class SignMessageComponent extends React.Component<ISignMessageComponentProps, ISignMessageComponentState> {

    constructor(props: ISignMessageComponentProps) {
        super(props);

        this.state = {
            selectedTab: ESignTab.MAIN
        };
    }

    render() {
        const { user, balance, onCancel } = this.props;
        const { selectedTab } = this.state;

        return (
            <div className={styles.component}>
                <Box className={styles.header} between>
                    <UserComponent user={user} short/>
                    <Box col alignend>
                        <Text className={styles.headerlabel} label>Balance</Text>
                        <Text>{waves.format(balance || 0)} WAVES</Text>
                    </Box>
                </Box>
                <Box className={styles.txdescription} col alignstart>
                    <Box>
                        {this.renderTxLogo()}
                        <Text l descr>Sing Custom Data</Text>
                    </Box>
                    <Tabs
                        items={[ESignTab.MAIN]}
                        value={selectedTab}
                    />
                </Box>
                <Box className={styles.txtabcontent} col>
                    {this.renderTab()}
                </Box>
                <Box className={styles.footer}>
                    <Button className={styles.btncancel} onClick={onCancel}>Cancel</Button>
                </Box>
            </div>
        );
    }

    renderTab() {
        const { selectedTab } = this.state;

        switch (selectedTab) {
            case ESignTab.MAIN: return this.renderMainTab();
        }
    }

    renderMainTab() {
        const { message } = this.props;

        return (
            <>
                <Box className={styles.maininfo} col alignstart>
                    <Text label>Message</Text>
                    <Text className={styles.value}>{message}</Text>
                </Box>
                {this.renderConfirmOnLedger()}
            </>
        );
    }

    renderConfirmOnLedger() {
        return (
            <Box className={styles.confirmonledger} col>
                <Box center>
                    Compare details of the transaction on the screen with the details on the Ledger.
                    If they match, confirm it on your device
                </Box>
                <Box className={styles.ledgerlogo}>
                    <SvgLedgerLogoConfirm />
                </Box>
            </Box>
        );
    }

    renderTxLogo() {
        return (
            <Box className={styles.txlogo} center>
                <SvgTxInvokeScriptLogo />
            </Box>
        );
    }

}
