import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    bannerWrapper: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: Colors.green,
    },

    bannerContainer: {
        position: "relative"
    },

    btnWrapper: {
        position: "absolute",
        top: -7,
        right: -7,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 7,
        borderRadius: 50,
        backgroundColor: Colors.white
    },
})

export default styles;