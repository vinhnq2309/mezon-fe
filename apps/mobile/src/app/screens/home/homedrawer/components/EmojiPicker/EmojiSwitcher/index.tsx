import { HashSignIcon, SmilingFaceIcon } from '@mezon/mobile-components';
import React, { useEffect, useState } from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { IModeKeyboardPicker } from '../../BottomKeyboardPicker';

export type IProps = {
	mode: IModeKeyboardPicker;
	onChange: (mode: IModeKeyboardPicker) => void;
};

function EmojiSwitcher({ mode: _mode, onChange }: IProps) {
	const [mode, setMode] = useState<IModeKeyboardPicker>(_mode);

	const onPickerPress = () => {
		if (mode === 'text') {
			Keyboard.dismiss();
			onChange && onChange('emoji');
			setMode('emoji');
		} else {
			setMode('text');
			onChange && onChange('text');
		}
	};

	useEffect(() => {
		setMode(_mode);
	}, [_mode]);

	return (
		<View>
			<TouchableOpacity onPress={onPickerPress}>
				{mode !== 'emoji' ? <SmilingFaceIcon width={25} height={25} /> : <HashSignIcon width={25} height={25} />}
			</TouchableOpacity>
		</View>
	);
}

export default EmojiSwitcher;
