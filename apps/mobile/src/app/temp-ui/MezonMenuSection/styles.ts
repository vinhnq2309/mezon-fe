import { Colors, Fonts } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    sectionWrapper: {
        marginBottom: 20
    },

    sectionTitle: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '600',
        marginBottom: Fonts.size.s_10
    },

    section: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        overflow: 'hidden',
    },
})

export default styles;