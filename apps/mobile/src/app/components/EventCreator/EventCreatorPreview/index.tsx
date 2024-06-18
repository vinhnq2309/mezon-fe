import { Text, View } from "react-native";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { useTranslation } from "react-i18next";
import EventItem from "../../Event/EventItem";
import { useAuth } from "@mezon/core";
import MezonButton from "../../../temp-ui/MezonButton2";
import styles from "./styles";
import { OptionEvent } from "@mezon/utils";

type CreateEventScreenType = typeof APP_SCREEN.MENU_CLAN.CREATE_EVENT;
export default function EventCreatorPreview({ navigation, route }: MenuClanScreenProps<CreateEventScreenType>) {
    const { t } = useTranslation(['eventCreator']);
    const myUser = useAuth();
    // @ts-ignore
    const { type, channelId, location, startTime, endTime, title, description, frequency } = route.params;
    console.log(startTime, endTime);

    navigation.setOptions({
        headerTitle: t('screens.eventPreview.headerTitle')
    })

    return (
        <View style={styles.container}>
            <View style={styles.feedSection}>
                <EventItem
                    event={{
                        id: "",
                        start_time: startTime.toString(),
                        address: location,
                        user_ids: [],
                        creator_id: myUser.userId,
                        title: title,
                        description: description,
                        channel_id: channelId,
                    }} />

                <View style={styles.headerSection}>
                    <Text style={styles.title}>{t("screens.eventPreview.title")}</Text>
                    {type === OptionEvent.OPTION_LOCATION
                        ? <Text style={styles.subtitle}>{t("screens.eventPreview.subtitle")}</Text>
                        : <Text style={styles.subtitle}>{t("screens.eventPreview.subtitleVoice")}</Text>
                    }

                </View>
            </View>

            <MezonButton
                title={t('actions.next')}
                type="success"
            />
        </View>
    )
}