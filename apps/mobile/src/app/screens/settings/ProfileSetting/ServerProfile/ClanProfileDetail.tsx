import { Text, View } from "react-native";
import { MezonInput } from "../../../../../app/temp-ui";
import { useTranslation } from "react-i18next";
import { IClanProfileValue } from "..";
import { styles } from "./styles";

interface IClanProfileDetailProps {
    value: IClanProfileValue,
    onChange: (value: Partial<IClanProfileValue>) => void
}
export default function ClanProfileDetail({ value, onChange }: IClanProfileDetailProps) {
    const { t } = useTranslation(['profileSetting']);

    return (
        <View style={styles.clanProfileDetail}>
            <View style={styles.nameWrapper}>
                <Text style={styles.displayNameText}>{value?.displayName || value?.username}</Text>
                <Text style={styles.userNameText}>{value?.username}</Text>
            </View>

            <MezonInput
                value={value?.displayName}
                onTextChange={(newValue) => onChange({displayName: newValue})}
                placeHolder={value?.username}
                maxCharacter={32}
                label={t('fields.displayName.label')}
            />
        </View>
    )
}