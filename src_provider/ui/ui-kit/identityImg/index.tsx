import React from 'react';
import cn from 'classnames';

import styles from './styles.less';

interface IIdentityImgProps extends React.ComponentPropsWithoutRef<'img'> {
    hash: string;
}

export class IdentityImg extends React.Component<IIdentityImgProps> {

    render() {
        const { className } = this.props;

        return (
            <div className={cn(styles.component, className)}>&nbsp;</div>
        );
    }
}
