import React from 'react';

import { PopupLayout, Dialog } from '../../ui-kit'; // todo module

interface IPopupContainerProps {
    onClose: () => void;
}

export class PopupContainer extends React.Component<IPopupContainerProps> {
    render() {
        return (
            <PopupLayout>
                <Dialog onClose={this.props.onClose}>
                    {this.props.children}
                </Dialog>
            </PopupLayout>
        );
    }
}
