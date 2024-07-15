import { Attributes, Fonts, Metrics } from "@mezon/mobile-ui";
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

    input: {
        backgroundColor: colors.secondary
    }
})