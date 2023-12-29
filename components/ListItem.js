import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useTeacher } from "../context/TeacherContextProvider";
import { useHelper } from "../context/HelperContextProvider";
import constants from "../constants";

const ListItem = ({ item, theme = constants.color.lightBlue }) => {
    
    const { setShowMenuOptions: showTeacherMenu, setSelectedTeacher } = useTeacher();
    const { setShowMenuOptions: showHelperMenu, setSelectedHelper } = useHelper();

    const optionsButtonPressedHandler = () => {
        setSelectedTeacher(item);
        setSelectedHelper(item);
        showTeacherMenu(prev => !prev);
        showHelperMenu(prev => !prev);
    };


    const styles = StyleSheet.create({
        itemContainer: {
            height: 60,
            backgroundColor: theme,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 3,
            paddingHorizontal: 20,
            width: "100%",
            alignSelf: "center",
            marginBottom: 10,
            elevation: 3
        },
        itemTitle: {
            fontSize: 20,
            fontWeight: "600",
            marginHorizontal: 10,
            color: "#ffffffcc"
        },
        dropdownContainer: {
            overflow: "visible",
            flex: 1,
            alignItems: "flex-end",
        },
        dropdownMenu: {
            backgroundColor: "white",
            position: "absolute",
            top: 60, // Ajusta según sea necesario
            right: 20, // Ajusta según sea necesario
            elevation: 20,
            justifyContent: "center",
    
        },
        menuOption: {
            padding: 10,
    
        },
        menuArrow: {
            width: 20,
            height: 20,
            position: "absolute",
            transform: [
                { rotate: "45deg" }
            ],
            backgroundColor: "white",
            top: -6,
            right: 10
    
        }
    });

    return (
        <View style={styles.itemContainer}>
            {item.sex == "hombre" ? <SimpleLineIcons name="user" size={20} color="#ffffffcc" />: <SimpleLineIcons name="user-female" size={20} color="#ffffffcc" />}
            <Text style={styles.itemTitle}>{item.name} {item.lastName}</Text>

            <View style={styles.dropdownContainer}>
                <Pressable onPress={optionsButtonPressedHandler} style={{ padding: 10 }} android_ripple={{ color: "#ddd" }}>
                    <SimpleLineIcons name="options-vertical" size={21} color="#ffffffcc" />
                </Pressable>
            </View>
            <View style={{width: 200, height: 5, backgroundColor: "white", position: "absolute", bottom: 0}}/>
        </View>
    );
};


export default React.memo(ListItem);
