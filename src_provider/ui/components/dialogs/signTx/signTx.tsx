import React from 'react';
// import {  WavesLedgerSync } from '@waves/ledger';
import { IUser } from '@waves/ledger';

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
                        <Text label>Balance</Text>
                        <Text>10.123 Waves</Text>
                    </Box>
                </Box>
                <Box className={styles.txinfo}>
                    {this.getTxLogo()}
                    <Text l descr>{this.getTxTitle()}</Text>
                </Box>
                <Tabs
                    items={[ESignTab.MAIN, ESignTab.DETAILS, ESignTab.JSON]}
                    value={selectedTab}
                    onChange={(v) => this.onChangeTab(v)}
                />
                {this.renderTab()}
                <Button className={styles.btncancel} onClick={onCancel}>Отмена</Button>
            </div>
        );
    }

    renderTab() {
        const { selectedTab } = this.state;

        switch (selectedTab) {
            case ESignTab.MAIN: return this.getMainTab();
            case ESignTab.DETAILS: return this.getDetailsTab();
            case ESignTab.JSON: return this.getJsonTab();
        }
    }

    getMainTab() {
        const { tx } = this.props;

        return (
            <Box col>
                <Box className={styles.maininfo} col start>
                    <Text label className={styles.title}>TXID</Text>
                    <Text className={styles.value}>{tx.id}aaaaaaaaaaaaaaa</Text>
                </Box>
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

    getDetailsTab() {
        const { tx } = this.props;

        return ('Details');
    }

    getJsonTab() {
        const { tx } = this.props;

        return (
            <div>
                <Textarea className={styles.jsonpreview}>
                    {this.getJsonPreview(tx)}
                </Textarea>
            </div>
        );
    }

    getJsonPreview(json: any) {
        return JSON.stringify(json, null, ' ');
    }

    getTxLogo() {
        return (
            <Box className={styles.txlogo} center>
                <SvgTxInvokeScriptLogo />
            </Box>
        );
    }

    getTxTitle() {
        return 'Invoke Script Transaction';
    }

    onChangeTab(tab) {
        this.setState({ selectedTab: tab })
    }
}
