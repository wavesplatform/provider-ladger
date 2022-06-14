import React from 'react';

import {
	Box,
	Text,
	Hash,
} from '../../../../ui-kit'; // todo ui-kit

import {
	waves,
} from '../../../../../helpers'

import styles from './styles.less'

export interface ITransferDetailsProps {
	assetsDetails: any;
	tx: any; // todo tx type
};

export class TransferDetails extends React.Component<ITransferDetailsProps> {

	render() {
		const { tx } = this.props;

		return (
			<Box className={styles.container} col>
				{
					(
						tx.recipient && (<>
						<Text label className={styles.label}>Recipient</Text>
						<Text className={styles.value}>{tx.recipient}</Text>
						</>)
					)
				}
				<Text label className={styles.label}>Fee</Text>
				<Text className={styles.value}>{waves.amountView(tx.fee)} WAVES</Text>
				<Text label className={styles.label}>Amount</Text>
				{this.getAmount()}
				{
					(
						tx.attachment && (<>
						<Text label className={styles.label}>Attachment </Text>
						<Text className={styles.value}>{tx.attachment}</Text>
						</>)
					)
				}
			</Box>
		);
	}

	getAmount() {
		const { tx, assetsDetails } = this.props;
		let { amount, assetId } = tx;
		let name;
		let amountComponent;

		if (assetId == null) {
			amount = waves.amountView(amount, 8);
			name = waves.WAVES_SYMBOL;

			amountComponent = <Text className={styles.value}>{amount} {name}</Text>;
		} else {
			const details = assetsDetails.find((details) => {
				return details.assetId == assetId;
			});

			amount = waves.amountView(amount, details.decimals);
			name = (<a href={details.assetInfoUrl} target='_blank'>{details.name}</a>);

			amountComponent = (
				<Text className={styles.value}>
					<span>{amount} {name}</span>&nbsp;&nbsp;
					<Text label>(id: <Hash hash={assetId} short/>)</Text>
				</Text>
			);
		}

		return amountComponent;
	}

}
