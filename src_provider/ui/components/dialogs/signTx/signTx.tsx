import React from 'react';
import { IUser } from '@waves/ledger';

import { getTxName } from '../../../helpers'; // todo ui-kit
import { waves } from '../../../../helpers';

import {
    Box,
    Button,
    Tabs,
    Text,
    Textarea,
    SvgTxInvokeScriptLogo,
    SvgLedgerLogoConfirm,
} from '../../../ui-kit'; // todo ui-kit

import { UserComponent } from '../../user';

import {
    InvokeDetails,
    TransferDetails,
} from './txDetails';

import styles from './styles.less'

enum ESignTab {
    MAIN = 'Main',
    DETAILS = 'Details',
    JSON = 'JSON',
}

export interface ISignTxComponentProps {
    assetsDetails: any;
    balance?: any;
    tx: any; // todo tx type
    user: IUser;
    onCancel: () => void;
};

interface ISignTxComponentState {
    selectedTab: ESignTab
};

export class SignTxComponent extends React.Component<ISignTxComponentProps, ISignTxComponentState> {

    constructor(props: ISignTxComponentProps) {
        super(props);

        this.state = {
            selectedTab: ESignTab.MAIN
        };
    }

    render() {
        const { tx, user, balance, onCancel } = this.props;
        const { selectedTab } = this.state;

        return (
            <div className={styles.component}>
                <Box className={styles.header} between>
                    <UserComponent user={user} short/>
                    <Box col alignend>
                        <Text className={styles.headerlabel} label>Balance</Text>
                        <Text>{waves.format(balance || 0, 8).toFixed(2)} WAVES</Text>
                    </Box>
                </Box>
                <Box className={styles.txdescription} col alignstart>
                    <Box>
                        {this.renderTxLogo()}
                        <Text l descr>{this.getTxTitle()}</Text>
                    </Box>
                    <Tabs
                        items={[ESignTab.MAIN, ESignTab.DETAILS, ESignTab.JSON]}
                        value={selectedTab}
                        onChange={(v) => this.onChangeTab(v)}
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
            case ESignTab.DETAILS: return this.renderDetailsTab();
            case ESignTab.JSON: return this.renderJsonTab();
        }
    }

    renderMainTab() {
        const { tx } = this.props;

        return (
            <>
                <Box className={styles.maininfo} col alignstart>
                    <Text label>Transaction ID</Text>
                    <Text className={styles.value}>{tx.id}</Text>
                </Box>
                {this.renderConfirmOnLedger()}
            </>
        );
    }

    renderDetailsTab() {
        const { tx } = this.props;

        return (
            <>
                {this.getDetails()}
                {this.renderConfirmOnLedger()}
            </>
        );
    }

    renderJsonTab() {
        const { tx } = this.props;

        return (
            <Textarea className={styles.jsonpreview} readOnly>
                {this.renderJsonPreview(tx)}
            </Textarea>
        );
    }

    renderJsonPreview(json: any) {
        return JSON.stringify(json, null, ' ');
    }

    renderConfirmOnLedger() {
        return (
            <Box className={styles.confirmonledger} col>
                <Box center>
                    <Text>
                        Compare details of the transaction on the screen with the details on the Ledger.
                        If they match, confirm it on your device
                    </Text>
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

    getDetails () {
        const { tx, assetsDetails } = this.props;

        switch (tx.type) {
            case 4: return (<TransferDetails tx={tx} assetsDetails={assetsDetails} />);
            case 16: return (<InvokeDetails tx={tx} assetsDetails={assetsDetails} />);
        }
    }

    getTxTitle() {
        const txName = getTxName(this.props.tx.type);

        return `${txName} Transaction`;
    }

    onChangeTab(tab) {
        this.setState({ selectedTab: tab })
    }
}
