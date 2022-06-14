import React from 'react';

import styles from './styles.less';

export class PopupLayout extends React.Component {

	render() {
		return (
			<div className={styles.component}>
				{this.props.children}
			</div>
		);
	}
}
