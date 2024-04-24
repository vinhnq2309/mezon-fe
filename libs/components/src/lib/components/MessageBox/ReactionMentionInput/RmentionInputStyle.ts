export default {
	control: {
		backgroundColor: '#000',
		fontSize: 15,
	},

	'&multiLine': {
		control: {
			fontFamily: 'Noto Sans, sans-serif',
			minHeight: 35,
			border: 'none',
			outline: 'none',
		},
		highlighter: {
			padding: 9,
			border: '1px solid transparent',
		},
		input: {
			padding: 9,
			border: 'none',
			outline: 'none',
			whiteSpace: 'pre-wrap'
		},
	},

	'&singleLine': {
		display: 'inline-block',
		width: 180,

		highlighter: {
			padding: 1,
			border: '2px inset transparent',
		},
		input: {
			padding: 1,
			border: '2px inset',
		},
	},

	suggestions: {
		padding: '5px 0',
		width: '100%',
		borderRadius: 12,
		marginBottom: 20,
		backgroundColor: '#272822',
		list: {
			maxHeight: 400,
			overflowY: 'auto',
			backgroundColor: '#272822',
		},
		item: {
			padding: '5px 15px',
			borderBottom: '1px solid rgba(0,0,0,0.15)',
			'&focused': {
				backgroundColor: '#41433A',
			},
		},
	},
};
