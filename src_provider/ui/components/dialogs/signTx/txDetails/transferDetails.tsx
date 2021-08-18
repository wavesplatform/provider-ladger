import React from 'react';

import {
    Box,
    Text
} from '../../../../ui-kit'; // todo ui-kit

// import styles from './styles.less'

export interface ITransferDetailsProps {
    tx: any; // todo tx type
};

export class TransferDetails extends React.Component<ITransferDetailsProps> {

    render() {
        const { tx } = this.props;

        return (
            <Box>
                <Text>transfer details</Text>
            </Box>
        );
    }
}
