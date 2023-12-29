import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const FloatingAddButton = ({ onPressed, color }) => {
    return (
        <TouchableOpacity style={[styles.fab, {backgroundColor: color? color: "black"}]} onPress={onPressed}>
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        elevation: 10
    },
    fabText: {
        fontSize: 20,
        color: 'white',
        position: "relative",
        top: -1,
    }
});

export default FloatingAddButton;