import React from 'react';
// import {  WavesLedgerSync } from '@waves/ledger';
import { IUser } from '@waves/ledger';

import { getTxName } from '../../../helpers'; // todo ui-kit

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

import styles from './styles.less'

enum ESignTab {
    MAIN = 'Main',
    DETAILS = 'Details',
    JSON = 'JSON',
}

export interface ISignTxComponentProps {
    // ledger: WavesLedgerSync;
    balance?: number;
    tx: any; // todo tx type
    user: IUser;
    onCancel: () => void;
}

interface ISignTxComponentState {
    selectedTab: ESignTab
}

export class SignTxComponent extends React.Component<ISignTxComponentProps, ISignTxComponentState> {

    constructor(props: ISignTxComponentProps) {
        super(props);

        this.state = {
            selectedTab: ESignTab.MAIN
        };
    }

    render() {
        const { tx, user, onCancel } = this.props;
        const { selectedTab } = this.state;

        return (
            <div className={styles.component}>
                <Box className={styles.header} between>
                    <UserComponent user={user} short/>
                    <Box col alignend>
                        <Text className={styles.headerlabel} label>Balance</Text>
                        <Text>10.123 Waves</Text>
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
                    <Button className={styles.btncancel} onClick={onCancel}>Отмена</Button>
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
                    <Text label>TXID</Text>
                    <Text className={styles.value}>{tx.id}3PF4AY38H14Kt7W5HwMxe2Q9YBz8eGxhDHf*</Text>
                </Box>
                {this.renderConfirmOnLedger()}
            </>
        );
    }

    renderDetailsTab() {
        const { tx } = this.props;

        return (
            <>
                <Box col>
                    <Text>Recipient</Text>
                    <Text>Fee</Text>
                    <Text>dApp</Text>
                    <Text>Function</Text>
                    <Text>Payments</Text>
                </Box>
                {this.renderConfirmOnLedger()}
            </>
        );
    }

    renderJsonTab() {
        const { tx } = this.props;

        return (
            <Textarea className={styles.jsonpreview}>
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
                    Сверьте данные на экране с данными в Ledger. <br />
                    Если данные совпадают, то подтвердите это на устройстве
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

    getTxTitle() {
        const txName = getTxName(this.props.tx.type);

        return `${txName} Transaction`;
    }

    onChangeTab(tab) {
        this.setState({ selectedTab: tab })
    }
}
