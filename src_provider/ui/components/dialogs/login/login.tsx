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
    SvgArrowLeft,
    SvgArrowRight,
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
    isLoadingPage: boolean;
    loadedPage: number;
    currentPage: number;
}

const USER_PER_PAGE = 5;

export class LoginComponent extends React.Component<ILoginComponentProps, IloginComponentState> {
    constructor(props: ILoginComponentProps) {
        super(props);

        const isAuthUser = props.lastAuthUserId !== undefined && props.authUserList?.some((user) => user.id === props.lastAuthUserId);
        let selectedUser = isAuthUser ? props.authUserList?.find((user) => user.id === props.lastAuthUserId) : null;

        this.state = {
            selectedUser: isAuthUser && selectedUser ? selectedUser : null,
            state: isAuthUser ? ELoginState.LAST_AUTH : ELoginState.LEDGER_LIST,
            ledgerUserList: [],
            isLoadingPage: false,
            loadedPage: 0,
            currentPage: 0
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
            this.loadNextPage();
        }
    }

    loadNextPage() {
        const { ledger } = this.props;
        const { selectedUser, loadedPage, isLoadingPage } = this.state;

        if (isLoadingPage) {
            return;
        }

        const page = this.getPage(loadedPage);

        this.setState({ isLoadingPage: true });
        ledger.getPaginationUsersData(page.start, USER_PER_PAGE - 1)
            .then((users: IUser[]) => {
                const { ledgerUserList } = this.state;

                this.setState({
                    isLoadingPage: false,
                    loadedPage: loadedPage + 1,
                    selectedUser: selectedUser ? selectedUser : users[0], // todo remove auto set
                    ledgerUserList: ledgerUserList.concat(users)
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
        const { ledgerUserList, selectedUser, currentPage } = this.state;

        if(ledgerUserList?.length == 0) {
            return (
                <Box className={styles.ledgerusers} col>
                    <Text>Загрузка аккаунтов...</Text>
                </Box>
            );
        } else {
            const position = `-${100*currentPage}%`;

            return (
                <Box className={styles.ledgerusers} col>
                    <Box className={styles.slider}>
                        <Box className={cn(styles.arrow, styles.prev)} onClick={this.onPrevPage.bind(this)}>
                            <SvgArrowLeft />
                        </Box>
                        <Box className={cn(styles.arrow, styles.next)} onClick={this.onNextPage.bind(this)}>
                            <SvgArrowRight />
                        </Box>
                        <div className={styles.ledgeruserlistcontainer}>
                            <Box className={styles.ledgeruserlist} style={{ left: position }}>
                                {ledgerUserList.map(this.renderLedgerUser, this)}
                                <Box className={styles.loadingpage}><Text>Загрузка аккаунтов...</Text></Box>
                            </Box>
                        </div>
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
                </Box>
            );
        }
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
                <Text className={styles.ledgerusername} s inactive={!isSelected}>Account {index}</Text>
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
            this.loadNextPage();
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

    onPrevPage() {
        const { currentPage } = this.state;
        const page = currentPage - 1;

        if (currentPage == 0) {
            return;
        }

        this.setState({ currentPage: page });
        console.log(page);
    }

    onNextPage() {
        const { currentPage, loadedPage } = this.state;
        const page = currentPage + 1;
        const isLastPage = (currentPage == loadedPage - 1)

        if (currentPage >= loadedPage) {
            return;
        }

        if (isLastPage) {
            this.loadNextPage();
        }

        this.setState({ currentPage: page });
        console.log(page);
    }
}
