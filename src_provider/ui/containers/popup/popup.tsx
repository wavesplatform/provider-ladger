import React from "react";
import styles from "./styles.less";

interface IPopupContainerProps {
    onClose: () => void;
}

export class PopupContainer extends React.Component<IPopupContainerProps> {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.dialog}>
                    <div className={styles.close} onClick={this.props.onClose}>закрыть</div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
