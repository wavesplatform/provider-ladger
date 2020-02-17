import renderPage from '../utils/renderPage';
import { libs } from '@waves/waves-transactions';
import { IUserData } from '@waves/signer';
import React from 'react';
import { IState } from '../interface';
import ledgerService from '../services/ledgerService';
import styled from '@emotion/styled';
import Box from '../components/Box'
import Title from '../components/Title';
import Button from '../components/Button';
export default function (state: IState): () => Promise<IUserData> {
    return (): Promise<IUserData> => {
        if (state.user != null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: libs.crypto.publicKey({
                    privateKey: state.user.privateKey,
                }),
            });
        } else {
            // const hasAcc = hasAccount();
            // const termsAccepted = isTermsAccepted();

//todo
            return new Promise((resolve, reject) => {
                renderPage(
                    <Box>
                        <Title>Hi there</Title>
                        <Button onClick={() => getUser()}>Click me</Button>
                    </Box>
                );
            });
        }
    };
}






async function getUser() {
    const go = async () => {
        if (ledgerService.instance != null) {
            console.log(await ledgerService.adapter.getUserList(0, 0));

        } else {
            setTimeout(async () => {
                console.log('not connected')
                await go()
            }, 1000);
        }
    };

    await go();
}

