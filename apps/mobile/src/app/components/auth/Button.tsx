import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
interface ButtonProps {
    isValid: boolean;
    onPress: () => void;
    title: string;
    disabled: boolean
}
const Button: React.FC<ButtonProps> = ({ isValid, onPress, title, disabled }) => {
    // const loading = useSelector(state => state?.auth?.loading);
    const [loading, setLoading] = useState(false)
    return (
        <Pressable style={[styles.button, { backgroundColor: isValid ? '#155EEF' : '#A5C9CA' }]}
            disabled={disabled}
            onPress={onPress}
        >
            {loading ? (
                <Text style={styles.signinButtonText}>Loading</Text>
            ) : (
                <Text style={styles.signinButtonText}>{title}</Text>
            )}
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 50
    },
    signinButtonText: {
        fontSize: 18,
        lineHeight: 18 * 1.4,
        color: "#FFFFFF"
    },
})