import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text, Modal, ViewStyle  } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";



export const XYCenteredFullSize = ({ children, alterStyle }) => {
    const style = StyleSheet.create({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    });

    return (
        <View style={[style, alterStyle]}>{children}</View>
    )
}

export const FlexDirection = ({ children, alterStyle, direction, gap }) => {

    const style = StyleSheet.create({
        flexDirection: direction,
        gap
    })

    return (
        <View style={[style, alterStyle]}>{children}</View>
    )
}

export const MenuOptionsModal = ({ visibilityController, options = [] }) => {

    const [visible, setVisible] = visibilityController;


    const styles = StyleSheet.create({
        optionsModalBackground: {
            flex: 1,
            flexDirection: "column-reverse",
        },
        optionsModalContainer: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 30,
            backgroundColor: "white",
        },
        menuOption: {
            padding: 20,
            paddingTop: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        MenuOptionsModalPressableBackground: {
            width: "100%",
            height: "100%",
            backgroundColor: "#00000055",
            position: "absolute",
            top: 0
        }
    })

    const optionsList = options.map(({ title, icon, action }) => {

        return (
            <View key={title}>
                <Pressable
                    android_ripple={{ color: "#ddd" }}
                    style={styles.menuOption}
                    onPress={() => action()}>

                    <SimpleLineIcons
                        name={icon}
                        color="black"
                        size={20}
                    />

                    <Text style={{ fontSize: 16 }}>{title}</Text>
                </Pressable>
            </View>
        )
    })

    return (
        <>
            <Modal
                visible={visible}
                animationType='slide'
                transparent={true}>

                <Pressable
                    style={styles.optionsModalBackground}
                    onPress={() => setVisible(false)}>

                    <View style={styles.optionsModalContainer}>
                        {optionsList}
                    </View>

                </Pressable>
            </Modal>

            {visible && (
                <Pressable
                    onPress={() => setVisible(false)}
                    style={styles.MenuOptionsModalPressableBackground}
                />
            )}
        </>
    )
}

export const Box = ({ children, alterStyle }) => {

    const style = StyleSheet.create({
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
    })

    return (
        <View style={[style, alterStyle]}>
            {children}
        </View>
    )
}

export const ButtonRipple = ({ onPress, text, backgroundColor, alterStyle }) => {

    const styles = StyleSheet.create({
        container: {
            width: 120,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            overflow: "hidden",
        },
        pressable: {
            padding: 10,
            borderRadius: 3,
            backgroundColor: '#3498db',
            margin: 5,
        },
        text: {
            color: "#ffffffcc"
        }
    });


    const alteredStyle = {
        backgroundColor,
        ...alterStyle
    }

    return (
        <View style={[styles.container, alteredStyle]} >
            <Pressable style={[styles.container, alteredStyle]} android_ripple={{ color: '#ddd' }} onPress={onPress}>
                <View style={{ overflow: "hidden" }}>
                    <Text style={styles.text} >{text}</Text>
                </View>
            </Pressable>
        </View>
    );
};