import React from 'react';
import { IUser, WavesLedgerSync } from '@waves/ledger';
import { UserComponent } from '../../user/user';

import styles from './styles.less';

export interface ILoginComponentProps {
    ledger: WavesLedgerSync;
    onLogin: (user: IUser) => void
    selectedUserId?: number;
}

interface IloginComponentState {
    selectedUser: IUser | null;
    userList: IUser[];
    paginationIndex: number;
}

const USER_PER_PAGE = 3;

export class LoginComponent extends React.Component<ILoginComponentProps, IloginComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            selectedUser: null,
            userList: [],
            paginationIndex: 0
        };
    }

    render() {
        const { selectedUserId } = this.props;
        const { selectedUser, userList } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.title}>Выбор Ledger аккаунта</div>
                <div className={styles.subtitle}>Выберите адрес</div>
                {/* <div className={styles.selectedUser}>
                    {
                        selectedUser
                        ? (<UserComponent user={selectedUser} onClick={this.onSelectUser.bind(this)}/>)
                        : ('Выберите аккаунт')
                    }
                </div> */}
                <div className={styles.userlist}>
                    {
                        userList.length
                        ? userList.map((user) => {
                            let current = false;
                            
                            if (selectedUser) {
                                if (selectedUser.id === user.id) {
                                    current = true;
                                }
                            } else if (selectedUserId != null) {
                                if (selectedUserId === user.id) {
                                    current = true;
                                }
                            }

                            return (
                                <UserComponent
                                    user={user}
                                    onClick={this.onSelectUser.bind(this)}
                                    active={current}
                                />
                            );
                        })
                        : 'Загрузка пользователей...'
                    }
                </div>
                <button
                    className={styles.button}
                    onClick={this.onClickLoadMoreUsers.bind(this)}
                >
                    more users
                </button>
                <button
                    className={styles.button}
                    onClick={this.onLogin.bind(this)}
                >
                    login
                </button>
            </div>
        );
    }

    componentDidMount() {
        this.loadMoreUser();

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

    loadMoreUser() {
        const { ledger } = this.props;
        const page = this.getPage(this.state.paginationIndex);

        ledger.getPaginationUsersData(page.start, page.end)
            .then((users: IUser[]) => {
                const userList = this.state.userList;

                this.setState({ userList: userList.concat(users) });
            });

        this.setState({ paginationIndex: this.state.paginationIndex + 1 });
    }

    getPage(page): { start: number, end: number} {
        const start = page * USER_PER_PAGE;
        const end = start + USER_PER_PAGE - 1;

        return {
            start,
            end
        };
    }

    onSelectUser(user: IUser) {
        this.setState({ selectedUser: user });
    }

    onClickLoadMoreUsers() {
        this.loadMoreUser();
    }

    onLogin() {
        const props = this.props;
        const state = this.state;

        if (state.selectedUser) {
            props.onLogin(state.selectedUser);
        }
    }
}
