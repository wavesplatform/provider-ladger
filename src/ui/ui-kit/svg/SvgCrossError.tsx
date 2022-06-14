import React from 'react';

export class SvgCrossError extends React.Component {
	render() {
		return (
			<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="45" cy="45" r="42.5" stroke="#E5494D" stroke-width="5"/>
				<rect x="27" y="59.8749" width="46.4921" height="4.41963" rx="1" transform="rotate(-45 27 59.8749)" fill="#E5494D"/>
				<rect x="30.1255" y="27" width="46.4921" height="4.41963" rx="1" transform="rotate(45 30.1255 27)" fill="#E5494D"/>
			</svg>
		);
	}
}
