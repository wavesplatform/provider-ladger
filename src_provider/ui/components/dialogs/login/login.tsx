import React from 'react';
import cn from 'classnames';

import { IUser, WavesLedgerSync } from '@waves/ledger';
import { UserComponent } from '../../user';

import {
    Box,
    Button,
    IdentityImg,
    SvgPlus,
    Text,
} from '../../../ui-kit'; // todo ui-kit

import styles from './styles.less';

enum ELoginState {
    LAST_AUTH = 'last_auth',
    LEDGER_LIST = 'ledger_list',
}

export interface ILoginComponentProps {
    ledger: WavesLedgerSync;
    onLogin: (user: IUser) => void
    lastAuthUserId?: number;
    authUserList?: IUser[];
}

interface IloginComponentState {
    state: ELoginState;
    selectedUser: IUser | null;
    ledgerUserList: IUser[];
    // paginationIndex: number;
}

const USER_PER_PAGE = 3;

export class LoginComponent extends React.Component<ILoginComponentProps, IloginComponentState> {
    constructor(props: ILoginComponentProps) {
        super(props);

        const isAuthUser = props.lastAuthUserId !== undefined && props.authUserList?.some((user) => user.id === props.lastAuthUserId);
        let selectedUser = isAuthUser ? props.authUserList?.find((user) => user.id === props.lastAuthUserId) : null;

        this.state = {
            selectedUser: isAuthUser && selectedUser ? selectedUser : null,
            state: isAuthUser ? ELoginState.LAST_AUTH : ELoginState.LEDGER_LIST,
            // authUserList: props.authUserList || [],
            ledgerUserList: [],
            // paginationIndex: 0
        };
    }

    render() {
        const { state, selectedUser } = this.state;

        return (
            <Box className={styles.component} col>
                <Text className={styles.title} xl>Choose Ledger account</Text>
                <Text className={styles.subtitle} l descr>Choose your address</Text>
                { state == ELoginState.LAST_AUTH ? this.renderLastAuth() : this.renderLedgerList() }
                <Box className={styles.footer} center>
                    <Button
                        className={styles.btnconfirm}
                        onClick={this.onLogin.bind(this)}
                        disabled={selectedUser === null}
                    >Confirm</Button>
                </Box>
            </Box>
        );
    }

    componentDidMount() {
        if (this.state.state === ELoginState.LEDGER_LIST)   {
            this.loadLedgerUsers();
        }
    }

    loadLedgerUsers() {
        const { ledger } = this.props;
        const { selectedUser } = this.state;

        ledger.getPaginationUsersData(0, 6)
            .then((users: IUser[]) => {
                this.setState({
                    selectedUser: selectedUser ? selectedUser : users[0], // todo remove auto set
                    ledgerUserList: users
                });
            });
    }

    renderLastAuth() {
        const { authUserList } = this.props;

        return (
            <Box className={styles.lastauth} col alignstart>
                <div className={styles.lastauthlist}>
                    {authUserList?.map(this.renderAuthUser, this)}
                </div>
                <Box className={styles.chooseanother} onClick={() => this.onChooseAnother()}>
                    <Box className={styles.plusicon} center><SvgPlus /></Box>
                    <Text>Choose another adress</Text>
                </Box>
            </Box>
        );
    }

    renderLedgerList() {
        const { ledgerUserList, selectedUser } = this.state;

        return (
            <Box className={styles.ledgerusers} col>
                {   ledgerUserList?.length > 0
                    ? (
                        <>
                            <Box className={styles.ledgeruserlist}>
                                {ledgerUserList.map(this.renderLedgerUser, this)}
                            </Box>
                            {
                                selectedUser
                                ? (
                                    <Box className={styles.accountinfo} col alignstart>
                                        <Text label>Account address</Text>
                                        <Text className={styles.fieldvalue}>{selectedUser?.address}</Text>
                                        <Text className={styles.fieldtitle} label>Account ID</Text>
                                        <Text className={styles.fieldvalue}>{selectedUser?.id}</Text>
                                    </Box>
                                )
                                : ''
                            }
                        </>
                    )
                    : 'Загрузка аккаунтов...'
                }
            </Box>
        );
    }

    renderAuthUser(user: IUser) {
        const { lastAuthUserId } = this.props;
        const { selectedUser } = this.state;
        const className = cn(styles.usercontainer, {
            [styles.selected]: selectedUser?.id === user.id
        });

        return (
            <Box className={className}>
                <UserComponent
                    onClick={() => { this.onSelectUser(user) }}
                    user={user}
                    latest={lastAuthUserId === user.id}
                />
            </Box>
        );
    }

    renderLedgerUser(user: IUser, index: number) {
        const { selectedUser } = this.state;
        const isSelected = selectedUser ? selectedUser.id === user.id : false

        return (
            <Box className={styles.ledgeruser} col onClick={() => { this.onSelectUser(user) }}>
                <IdentityImg hash={user.address} />
                <Text className={styles.ledgerusername} s inactive={!isSelected}>Аккаунт {index}</Text>
            </Box>
        );
    }

    getPage(page): { start: number, end: number} {
        const start = page * USER_PER_PAGE;
        const end = start + USER_PER_PAGE - 1;

        return {
            start,
            end
        };
    }

    onChooseAnother() {
        this.setState({
            state: ELoginState.LEDGER_LIST
        });

        if(this.state.ledgerUserList.length === 0) {
            this.loadLedgerUsers();
        }
    }

    onSelectUser(user: IUser) {
        this.setState({ selectedUser: user });
    }

    onLogin() {
        const props = this.props;
        const state = this.state;

        if (state.selectedUser) {
            props.onLogin(state.selectedUser);
        }
    }
}
