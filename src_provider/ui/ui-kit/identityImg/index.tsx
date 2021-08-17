import React from 'react';
import cn from 'classnames';
import { IOptions, create } from 'identity-img';

import styles from './styles.less';

interface IIdentityImgProps extends React.ComponentPropsWithoutRef<'img'> {
    hash: string;
}

const identityConfig: Partial<IOptions> = {
    randomColor: false,
    bgColor: '#C4C4C4',
    mainColor: '#000000',
    nanColor: '#000000',
    rows: 8,
    cells: 8
};

export class IdentityImg extends React.Component<IIdentityImgProps> {

    render() {
        const { className, hash } = this.props;
        const src = create(hash, identityConfig);

        return (
            <div className={cn(styles.component, className)}>
                <img src={src} className={styles.img} />
            </div>
        );
    }
}
