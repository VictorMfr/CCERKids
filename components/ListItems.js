import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native"
import ListItem from "./ListItem"


const useFilteredList = (listData) => {
    const [searchTermText, setSearchTermText] = useState();


    const filteredList = searchTermText ? listData.filter(item => (
        Object.values(item).some(value => (
            value.toString().includes(searchTermText))
        ))
    ) : listData

    return { filteredList, setSearchTermText, searchTermText };
}

const ListItems = ({ listData, metadataItemName, theme }) => {
    const { filteredList, setSearchTermText, searchTermText } = useFilteredList(listData);

    return (
        <View style={styles.list}>
            <View style={{ width: "100%", marginTop: 100 }}>
                <TextInput
                    value={searchTermText}
                    onChangeText={setSearchTermText}
                    placeholder={`Buscar ${metadataItemName}`}
                    style={styles.searchTermInput}
                />
            </View>

            {filteredList.length > 0 ? (

                <FlatList
                    style={{ height: "100%" }}
                    data={filteredList}
                    renderItem={({ item }) => <ListItem item={item} theme={theme} />}
                />

            ) : (<Text>No hay resultados de tu busqueda</Text>)}
        </View>
    )
}


const styles = StyleSheet.create({
    searchTermInput: {
        fontSize: 16,
        elevation: 1,
        backgroundColor: "white",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        padding: 10
    },
    list: {
        width: "100%",
        padding: 30,
        flex: 1,
    }
})

export default ListItems;