import React from 'react';

import {
    Box,
    Text,
    SvgExclamation
} from '../../../ui-kit'; // todo module

import styles from './styles.less';

export class BrowserNotSupportedComponent extends React.Component {

    render() {
        return (
            <Box className={styles.component} col>
                <SvgExclamation />
                <Text className={styles.text} l>
                    This browser is not supported.<br />
                    Use Ledger with Chromium based<br />
                    browsers like Google Chrome or Brave
                </Text>
            </Box>
        );
    }
}
