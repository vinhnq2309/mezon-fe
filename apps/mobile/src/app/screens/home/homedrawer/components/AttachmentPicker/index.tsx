import React from 'react';
import { Text, View } from 'react-native';

export type AttachmentPickerProps = {
	mode?: number;
};

function AttachmentPicker(props: AttachmentPickerProps) {
	return (
		<View>
			<Text>Handle Attachment picker</Text>
		</View>
	);
}

export default AttachmentPicker;
