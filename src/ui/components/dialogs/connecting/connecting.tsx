import React from 'react';

import {
	Box,
	SvgLedgerLogo,
	Loader,
	Text,
} from '../../../ui-kit'; // todo module

import { EConnectingState } from '../../../../ProviderLedger.interface';

import styles from './styles.less';

export interface IConnectingProps {
	getState: () => EConnectingState
};

interface IConnectingState {
	statusText: string;
}

export class ConnectingComponent extends React.Component<IConnectingProps, IConnectingState> {
	private updateTo: any; // NodeJs.Timer
	constructor(props: IConnectingProps) {
		super(props);

		this.updateTo = null;

		this.state = {
			statusText: this.getText(EConnectingState.CONNECT_LEDGER)
		};
	}

	render() {
		const { statusText } = this.state;

		return (
			<Box className={styles.component} col>
				<Box className={styles.ledgerlogo}><SvgLedgerLogo /></Box>
				<Text className={styles.title} xl>Connecting...</Text>
				<Box col alignstart>
					<Text className={styles.subtitle} m descr>{statusText}</Text>
				</Box>
				<Loader className={styles.loader} />
			</Box>
		);
	}

	componentDidMount() {
		this.updateTo = setTimeout(() => this.updateText(), 500);
	}

	componentWillUnmount() {
		clearTimeout(this.updateTo);
	}

	updateText() {
		this.setState({ statusText: this.getText(this.props.getState()) });
	}

	getText(state: EConnectingState) {
		return 'Connect Ledger device and open Waves app';
		// switch (state) {
		//     case EConnectingState.CONNECT_LEDGER: return 'Connect Ledger device';
		//     case EConnectingState.OPEN_WAVES_APP:
		//     case EConnectingState.READY: return 'Open WAVES application';
		// }
	}
}
