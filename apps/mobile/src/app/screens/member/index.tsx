import { useChannelMembers } from "@mezon/core";
import { selectCurrentChannelId } from "@mezon/store-mobile";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import MemberItem from "./MemberItem";
import style from "./style";

export default function MemberListStatus() {
    const currentChannelId = useSelector(selectCurrentChannelId);
    const { onlineMembers, offlineMembers } = useChannelMembers({ channelId: currentChannelId });

    return (
        <ScrollView style={style.container}>
            <>
                <Text style={style.text}>Member - {onlineMembers.length}</Text>

                <View style={style.box}>
                    {onlineMembers.map((user) => (
                        <MemberItem
                            user={user}
                            key={user?.user?.id}
                        />
                    ))}
                </View>
            </>

            {offlineMembers.length > 0 && (
                <View style={{marginTop: 40}}>
                    <Text style={style.text}>Offline - {offlineMembers.length}</Text>

                    <View style={style.box}>
                        {offlineMembers.map((user) => (
                            <MemberItem
                                user={user}
                                key={user?.user?.id}
                                isOffline={true}
                            />
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    )
}
