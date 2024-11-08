export default {
	control: {
		fontSize: 16
	},

	'&multiLine': {
		control: {
			fontFamily: 'gg sans, sans-serif',
			minHeight: 35,
			border: 'none',
			outline: 'none'
		},
		highlighter: {
			padding: 9,
			border: '1px solid transparent'
		},
		input: {
			padding: '9px 100px 9px 10px',
			border: 'none',
			outline: 'none',
			whiteSpace: 'pre-wrap',
			overflow: 'hidden auto'
		}
	},

	'&singleLine': {
		display: 'inline-block',
		width: 180,

		highlighter: {
			padding: 1,
			border: '2px inset transparent'
		},
		input: {
			padding: 1,
			border: '2px inset'
		}
	},

	suggestions: {
		top: '20px',
		list: {
			overflowY: 'auto',
			maxHeight: '450px'
		},
		item: {
			margin: '0 8px',
			padding: '8px',
			'&focused': {
				backgroundColor: '#35373C',
				borderRadius: 3
			}
		}
	}
};
