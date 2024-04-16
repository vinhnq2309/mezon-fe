
import { darkColor } from '../../../constants/Colors'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ServerDetail = () => {
    return (
        <View style={styles.serverDetailsContainer}>
            <Text style={{ color: 'white' }}>ServerDetails</Text>
        </View>
    )
}

export default ServerDetail

const styles = StyleSheet.create({
    serverDetailsContainer: {
        width: '60%',
        height: "98%",
        alignSelf: "flex-end",
        borderRadius: 8,
        backgroundColor: darkColor.Backgound_Disabled,
    }
})