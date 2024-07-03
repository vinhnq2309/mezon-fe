import { Colors, Fonts, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    avatar: {
        height: 35,
        width: 35,
        overflow: "hidden",
        borderRadius: 50,
    },

    avatarContainer: {
        position: "relative",
        width: 35,
        height: 35,
        borderRadius: 50
    },

    statusWrapper: {
        backgroundColor: Colors.secondary,
        padding: 2,
        position: "absolute",
        bottom: -4,
        right: -4,
        borderRadius: 50,
    },

    nameContainer: {
        paddingVertical: size.s_20,
        flexGrow: 1,
        borderBottomColor: Colors.borderDim,
    },

    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: size.s_12,
        paddingHorizontal: size.s_12,
        width: "100%"
    },

    textName: {
        color: Colors.textGray,
    }
})

export default style;
