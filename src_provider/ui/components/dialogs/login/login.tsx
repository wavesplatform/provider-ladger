import React from 'react';
import cn from 'classnames';

import { IUser, WavesLedgerSync } from '@waves/ledger';
import { UserComponent } from '../../user';

import {
    Box,
    Button,
    IdentityImg,
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
        const { lastAuthUserId } = this.props;
        const { state, selectedUser } = this.state;

        return (
            <Box className={styles.component} col>
                <Text className={styles.title} xl>Выбор Ledger аккаунта</Text>
                <Text className={styles.subtitle} l descr>Выберите адрес</Text>
                { state == ELoginState.LAST_AUTH ? this.renderLastAuth() : this.renderLedgerList() }
                <Box className={styles.footer}>
                    <Button
                        onClick={this.onLogin.bind(this)}
                        disabled={selectedUser === null}
                    >Подтвердить</Button>
                </Box>
            </Box>
        );
    }

    componentDidMount() {
        const { ledger } = this.props;
        const { selectedUser } = this.state;

        ledger.getPaginationUsersData(0, 6)
            .then((users: IUser[]) => {
                this.setState({
                    selectedUser: selectedUser ? selectedUser : users[0], // todo remove auto set
                    ledgerUserList: users
                });
            });

        // this.loadMoreUser();

        // const userId = this.props.selectedUserId;
        // if (userId != null) {
        //     this.loadUserById(userId);
        // }
    }

    // async loadUserById(userId: number) {
    //     const { ledger } = this.props;

    //     return ledger.getUserDataById(userId)
    //         .then((user: IUser) => {
    //             this.setState({ selectedUser: user });
    //         })
    // }

    // loadMoreUser() {
    //     const { ledger } = this.props;
    //     const page = this.getPage(this.state.paginationIndex);

    //     ledger.getPaginationUsersData(page.start, page.end)
    //         .then((users: IUser[]) => {
    //             const userList = this.state.userList;

    //             this.setState({ userList: userList.concat(users) });
    //         });

    //     this.setState({ paginationIndex: this.state.paginationIndex + 1 });
    // }

    renderLastAuth() {
        const { authUserList } = this.props;

        return (
            <Box className={styles.lastauth} start col>
                {authUserList?.map(this.renderAuthUser, this)}
                <Box className={styles.chooseanother} onClick={() => this.onChooseAnother()}>
                    <IdentityImg className={styles.avatar} hash='' />
                    <Text>Выбрать другой адрес</Text>
                </Box>
            </Box>
        );
    }

    renderLedgerList() {
        const { ledgerUserList, selectedUser } = this.state;

        return (
            <Box className={styles.ledgerlistcontainer} col>
                {   ledgerUserList?.length > 0
                    ? (
                        <>
                            <Box className={styles.ledgeruserlist}>
                                {ledgerUserList.map(this.renderLedgerUser, this)}
                            </Box>
                            {
                                selectedUser
                                ? (
                                    <Box className={styles.accountinfo} col start>
                                        <Text className={styles.fieldtitle} label>Адрес аккаунта</Text>
                                        <Text className={styles.fieldvalue}>{selectedUser?.address}</Text>
                                        <Text className={styles.fieldtitle} label>ID аккаунта</Text>
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
                <IdentityImg hash='' />
                <Text s inactive={!isSelected}>Аккаунт {index}</Text>
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
    }

    onSelectUser(user: IUser) {
        this.setState({ selectedUser: user });
    }

    // onClickLoadMoreUsers() {
    //     this.loadMoreUser();
    // }

    onLogin() {
        const props = this.props;
        const state = this.state;

        if (state.selectedUser) {
            props.onLogin(state.selectedUser);
        }
    }
}
