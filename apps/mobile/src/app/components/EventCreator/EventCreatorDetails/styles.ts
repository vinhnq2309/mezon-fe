import { Attributes, Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    title: {
        color: colors.textStrong,
        fontSize: Fonts.size.h6,
        textAlign: "center"
    },

    subtitle: {
        color: colors.text,
        fontSize: Fonts.size.h8,
        textAlign: "center"
    },

    bottomDescription: {
        color: colors.text,
        fontSize: Fonts.size.h8,
        marginVertical: Metrics.size.l
    },

    headerSection: {
        marginVertical: Metrics.size.xl
    },

    container: {
        paddingHorizontal: Metrics.size.xl,
        backgroundColor: colors.primary,
        flex: 1
    },

    feedSection: {
        flexBasis: 10,
        flexGrow: 1
    },

    inlineSec: {
        flexDirection: "row",
        gap: Metrics.size.xl
    },

    section: {
        gap: Metrics.size.m
    },

    btnWrapper: {
        paddingVertical: Metrics.size.xl,
        backgroundColor: colors.primary
    }
})