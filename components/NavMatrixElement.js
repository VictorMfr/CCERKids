import { SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";


const NavMatrixElement = ({ goTo, backgroundColor, text, iconName }) => {

    const alteredStyle = {
        backgroundColor
    }

    return (
        <View style={styles.NavMatrixElement} >
            <Pressable 
                style={[styles.NavMatrixElement, alteredStyle]} 
                android_ripple={{ color: "#ddd" }} 
                onPress={goTo} 
            >
                <View style={{ overflow: "hidden" }}>
                    <SimpleLineIcons 
                        name={iconName} 
                        size={40} 
                        color={"white"} 
                        style={{alignSelf: "center", marginBottom: 10}}
                    />
                    <Text style={styles.text} >{text}</Text>
                </View>

            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    NavMatrixElement: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 11,
        overflow: "hidden",
        elevation: 2
    },
    text: {
        color: "white"
    }
})


export default NavMatrixElement;