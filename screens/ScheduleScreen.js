import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, Pressable, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimpleLineIcons } from '@expo/vector-icons';
import FloatingAddButton from '../components/FloatingAddButton';
import constants from '../constants';
import { useSchedule } from '../context/ScheduleContextProvider';
import { ButtonRipple, FlexDirection } from '../components/UI';
import { useNavigation } from '@react-navigation/native';

const ListItem = ({ item }) => {

    const { setShowMenuOptions: showScheduleMenu, setSelectedSchedule, setShowDetailsSchedule } = useSchedule();

    const optionsButtonPressedHandler = () => {
        setSelectedSchedule(item);
        showScheduleMenu(true);
    };

    const title = item.title ? item.title : "";
    const target = item.target ? item.target : "";

    const listStyles = {
        bottomDecorationBar: {
            width: 200,
            height: 5,
            backgroundColor: "white",
            position: "absolute",
            bottom: 0
        },
        targetText: {
            fontSize: 14,
            color: "#ffffff99",
            width: "80%"
        }
    }

    return (
        <Pressable
            android_ripple={{ color: "white" }}
            style={styles.itemContainer}
            onPress={() => {
                setSelectedSchedule(item)
                setShowDetailsSchedule(true)
            }}
        >

            <View style={{ width: "80%" }}>
                <FlexDirection
                    direction={"row"}
                    gap={-5}
                    alterStyle={{ alignItems: "center", marginBottom: 10 }}>

                    <SimpleLineIcons name='direction' size={25} color={"white"} />
                    <Text style={styles.itemTitle}>{title}</Text>
                </FlexDirection>
                <FlexDirection
                    direction={"row"}
                    gap={-1}
                    alterStyle={{ alignItems: "center", marginBottom: 10 }}>

                    <SimpleLineIcons name='check' size={15} color={"white"} />
                    <Text
                        numberOfLines={2}
                        style={[styles.itemTitle, listStyles.targetText]}>{target}</Text>

                </FlexDirection>
            </View>
            <View style={styles.dropdownContainer}>
                <Pressable
                    onPress={optionsButtonPressedHandler}
                    style={{ padding: 10 }}
                    android_ripple={{ color: "#ddd", radius: 21 }}>

                    <SimpleLineIcons
                        name="options-vertical"
                        size={21}
                        color="#ffffffcc" />
                </Pressable>
            </View>
            <View style={listStyles.bottomDecorationBar} />
        </Pressable>
    );
};


const useFilteredList = (listData) => {
    const [searchTermText, setSearchTermText] = useState();

    const filteredList = searchTermText ? listData.filter(item => (
        Object.values(item).some(value => (
            value.toString().includes(searchTermText))
        ))
    ) : listData

    return { filteredList, setSearchTermText, searchTermText };
}

const ScheduleScreen = () => {

    // Create Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Form Inputs
    const [scheduleFormInputs, setScheduleFormInputs] = useState({ title: '', target: '' });
    const [tempBiblicQuotesInput, setTempBiblicQuotesInput] = useState("");
    const [tempBiblicRefsInput, setTempBiblicRefsInput] = useState("");
    const [error, setError] = useState({ error: false, message: "" });

    // Form List states
    const [tempBiblicRefsList, setTempBiblicRefsList] = useState([]);
    const [tempBiblicQuotesList, setTempBiblicQuotesList] = useState([]);

    // Custom Hooks
    const { showMenuOptions, setShowMenuOptions, selectedSchedule, setSelectedSchedule, schedules, setSchedules, setNewSchedules, showDetailsSchedule, setShowDetailsSchedule } = useSchedule();
    const { filteredList, setSearchTermText, searchTermText } = useFilteredList(schedules);
    const navigation = useNavigation();

    // Header Configuration
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable android_ripple={{ color: "#ddd", radius: 20 }} style={{ padding: 10 }} onPress={() => navigation.push("ScheduleMaker")}>
                    <SimpleLineIcons name='event' size={20} color={"white"} />
                </Pressable>
            ),
        });
    }, [navigation]);

    // Clear Form Inputs
    const clearFormInputs = () => {
        setScheduleFormInputs({ title: '', target: '' });
        setTempBiblicQuotesInput("");
        setTempBiblicQuotesList([]);
        setTempBiblicRefsInput("");
        setTempBiblicRefsList([]);
    }

    // Close Menu Options
    const closeItemMenuOptions = () => {
        setSelectedSchedule(null);
        setShowMenuOptions(false);
    }

    // UpdateScheduleModalHandler
    const updateScheduleHandler = async () => {
        
        if (!scheduleFormInputs.title || !scheduleFormInputs.target || !tempBiblicRefsList || !tempBiblicQuotesList) {
            return setError({ error: true, message: "Llene todos los datos para continuar" })
        }

        

        try {
            // Update the actual schedules list
            const updatedSchedulesList = schedules.map(schedule => (
                schedule.id == selectedSchedule.id ? {
                    title: scheduleFormInputs.title,
                    target: scheduleFormInputs.target,
                    biblic_refs: tempBiblicRefsList,
                    biblic_quotes: tempBiblicQuotesList
                } : schedule
            ))

            // Save the new Schedules array
            setNewSchedules(updatedSchedulesList)

            // Clear All Inputs
            clearFormInputs();

            // Close Modal
            setShowUpdateModal(false);

            // Close Menu Options Modal
            closeItemMenuOptions();

        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    }

    // Side Effect for getting the Schedules when mounting the component
    useEffect(() => {
        const getSchedulesFromStorage = async () => {
            try {
                const storedSchedules = await AsyncStorage.getItem('schedules');
                if (storedSchedules) {
                    const parsedSchedules = JSON.parse(storedSchedules);
                    setSchedules(parsedSchedules);
                }
            } catch (error) {
                console.error('Error retrieving schedules from AsyncStorage:', error);
            }
        };

        setShowMenuOptions(false)
        getSchedulesFromStorage();
    }, []);


    // Side Effect for filling the Update Modal Form Inputs with the selected Item data
    useEffect(() => {
        if (selectedSchedule) {
            setScheduleFormInputs({ title: selectedSchedule.title, target: selectedSchedule.target });
            setTempBiblicRefsList(selectedSchedule.biblic_refs);
            setTempBiblicQuotesList(selectedSchedule.biblic_quotes);
        }
    }, [selectedSchedule]);


    // Add New Schedule Handler
    const addScheduleHandler = async () => {
        if (!scheduleFormInputs.title || !scheduleFormInputs.target || !tempBiblicRefsList || !tempBiblicQuotesList) {
            return setError({ error: true, message: "Llene todos los datos para continuar" })
        }

        try {
            // Adding the new Schedule to the existing Schedules List
            const newSchedulesList = [
                ...schedules,

                {
                    title: scheduleFormInputs.title,
                    target: scheduleFormInputs.target,
                    biblic_refs: tempBiblicRefsList,
                    biblic_quotes: tempBiblicQuotesList,
                    id: new Date().getTime()
                }];

            // Saving the new List
            setNewSchedules(newSchedulesList);

            // Clearing All Form Inputs
            clearFormInputs();

            // Closing Modal
            setShowCreateModal(false);

        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    };

    // Delete Selected Schedule Handler
    const deleteSelectedScheduleHandler = async () => {

        // Get a list of Shedules without the selected Schedule
        const updatedSchedulesList = schedules.filter(schedule => (
            schedule.id !== selectedSchedule.id
        ));

        // Save the new list of Schedules
        setNewSchedules(updatedSchedulesList);

        // Close Menu Options Modal
        closeItemMenuOptions();
    }

    // Add Biblic Reference to the Form Biblic References List Handler
    const addTempBiblicRefsListHandler = () => {

        if (tempBiblicRefsInput == "") {
            return
        }

        // Update the Biblic References List
        setTempBiblicRefsList(prev => [...prev, tempBiblicRefsInput]);

        // Clear The Biblic Reference Input
        setTempBiblicRefsInput("");
    }

    // Delete Biblic Reference from the Form Biblic References List Handler
    const deleteTempRefListItemHandler = (reference) => {
        setTempBiblicRefsList(prev => prev.filter(rf => rf !== reference));
    }

    // Add Biblic Reference to the Form Biblic References List Handler
    const addTempBiblicQuotesListHandler = () => {

        if (tempBiblicQuotesInput == "") {
            return
        }

        // Update the Biblic Quotes List
        setTempBiblicQuotesList(prev => [...prev, tempBiblicQuotesInput]);

        // Clear The Biblic Quote Input
        setTempBiblicQuotesInput("")
    }

    // Delete Biblic Quote from the Form Biblic Quotes List Handler
    const deleteQuotesTempListItemHandler = (reference) => {
        setTempBiblicQuotesList(prev => prev.filter(rf => rf !== reference));
    }


    // Check if it can display the Shedules List
    const displayList = schedules.length === 0 ? (
        <Text style={styles.title}>No hay datos, comience a agregar pulsando "+"</Text>
    ) : (
        <View style={styles.list}>
            <View style={{ width: "100%", marginTop: 100 }}>
                <TextInput
                    value={searchTermText}
                    onChangeText={setSearchTermText}
                    placeholder={"Buscar planificación"}
                    style={styles.searchTermInput}
                />
            </View>

            {filteredList.length > 0 ? (

                <FlatList
                    style={{ height: "100%" }}
                    data={filteredList}
                    renderItem={({ item }) => <ListItem item={item} />}
                />

            ) : (
                <Text>No hay resultados de tu busqueda</Text>
            )}
        </View>
    )

    return (
        <View style={styles.background}>

            {displayList}

            <FloatingAddButton
                onPressed={() => {
                    setShowCreateModal(true)
                    setScheduleFormInputs({ title: "", target: "" });
                    setTempBiblicQuotesInput("");
                    setTempBiblicQuotesList([]);
                    setTempBiblicRefsInput("");
                    setTempBiblicRefsList([])
                }}
                color={constants.color.lightGreen}
            />

            

            <Modal visible={showDetailsSchedule} animationType='fade' transparent={true}>
                <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ alignItems: "center", width: "90%", height: "60%", paddingVertical: 20}}>
                        <Text style={{ fontSize: 20, padding: 20, backgroundColor: '#146738', color: "white", width: "100%", fontWeight: "600" }}>{selectedSchedule? selectedSchedule.title: ""}</Text>
                        <View style={{ width: "100%", flex: 1, padding: 20, backgroundColor: constants.color.lightGreen, marginBottom: 10, elevation: 10 }}>
                            <Text style={{ fontSize: 18, marginBottom: 10, color: "#146738", fontWeight: "600" }}>Objetivo: {selectedSchedule? selectedSchedule.target: ""}.</Text>
                            <Text style={{ fontSize: 15, marginBottom: 10, color: "#146738" }}>Referencias bíblicas: {'\n'} {selectedSchedule? selectedSchedule.biblic_refs.join(', '): ""}</Text>
                            <Text style={{ fontSize: 15, marginBottom: 10, color: "#146738" }}>Citas bíblicas: {'\n'} {selectedSchedule? selectedSchedule.biblic_quotes.join(', '): ""}</Text>
                            <View style={{ position: "absolute", bottom: 0, width: "80%", height: 5, backgroundColor: "white" }}></View>
                        </View>
                        <ButtonRipple text={"Cerrar"} backgroundColor={constants.color.lightGreen} onPress={() => {
                            setShowDetailsSchedule(false)
                        }} />
                    </View>
                </View>

            </Modal>


            <Modal
                visible={showCreateModal || showUpdateModal}
                animationType="fade"
                transparent={true}>


                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>
                        <ScrollView
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={'always'}
                        >
                            <Text style={styles.formTitle}>{showUpdateModal ? "Actualizar Planificación" : "Añadir Planificación"}</Text>
                            {error.error && <Text style={{ color: "red", marginBottom: 10 }}>{error.message}</Text>}
                            <TextInput
                                style={styles.input}
                                placeholder="Titulo"
                                value={scheduleFormInputs.title}
                                onChangeText={(text) => {
                                    setScheduleFormInputs({ ...scheduleFormInputs, title: text })
                                    setError({ error: false, message: "" })
                                }}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Objetivo"
                                value={scheduleFormInputs.target}
                                onChangeText={(text) => {
                                    setScheduleFormInputs({ ...scheduleFormInputs, target: text })
                                    setError({ error: false, message: "" })
                                }}
                            />

                            <Text style={{ fontSize: 16, marginBottom: 20, marginTop: 20 }}>Referencias Bíblicas</Text>


                            {/* Referencias biblicas */}

                            <View>
                                {tempBiblicRefsList && tempBiblicRefsList.map(ref => (
                                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }} key={new Date().getTime().toString() + Math.random()}>
                                        <SimpleLineIcons onPress={() => deleteTempRefListItemHandler(ref)} name='close' size={20} color={"black"} />
                                        <Text>{ref}</Text>
                                    </View>
                                ))}
                            </View>


                            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10 }}>
                                <TextInput
                                    placeholder='Añadir referencia'
                                    onChangeText={(text) => setTempBiblicRefsInput(text)}
                                    value={tempBiblicRefsInput}

                                    style={{
                                        padding: 2,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 5
                                    }} />
                                <Pressable onPress={addTempBiblicRefsListHandler} android_ripple={{ color: "#ddd", radius: -3 }} style={{ width: 95, flexDirection: "row", gap: 8, backgroundColor: constants.color.lightGreen, alignItems: "center", borderRadius: 3, padding: 0, paddingHorizontal: 10 }}>
                                    <SimpleLineIcons name='plus' color={"white"} size={21} style={{ marginBottom: 10, position: 'relative', top: 5 }} />
                                    <Text style={{ color: "white" }}>Añadir</Text>
                                </Pressable>
                            </View>


                            <Text style={{ fontSize: 16, marginBottom: 20, marginTop: 20 }}>Citas Bíblicas</Text>



                            {/* Citas biblicas */}

                            <View>
                                {tempBiblicQuotesList && tempBiblicQuotesList.map(quote => (
                                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 5 }} key={new Date().getTime().toString() + Math.random()}>
                                        <SimpleLineIcons onPress={() => deleteQuotesTempListItemHandler(quote)} name='close' size={20} color={"black"} />
                                        <Text>{quote}</Text>
                                    </View>
                                ))}
                            </View>


                            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10, marginBottom: 40 }}>
                                <TextInput
                                    placeholder='Añadir referencia'
                                    onChangeText={(text) => setTempBiblicQuotesInput(text)}
                                    value={tempBiblicQuotesInput}

                                    style={{
                                        padding: 2,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 5
                                    }} />
                                <Pressable onPress={addTempBiblicQuotesListHandler} android_ripple={{ color: "#ddd", radius: -3 }} style={{ width: 95, flexDirection: "row", gap: 8, backgroundColor: constants.color.lightGreen, alignItems: "center", borderRadius: 3, padding: 0, paddingHorizontal: 10 }}>
                                    <SimpleLineIcons name='plus' color={"white"} size={21} style={{ marginBottom: 10, position: 'relative', top: 5 }} />
                                    <Text style={{ color: "white" }}>Añadir</Text>
                                </Pressable>
                            </View>
                            <View style={styles.buttonContainer}>
                                <ButtonRipple text={showUpdateModal ? "Actualizar" : "Agregar"} onPress={showUpdateModal ? updateScheduleHandler : addScheduleHandler} backgroundColor={constants.color.lightGreen} />
                                <ButtonRipple text={"Cancelar"} onPress={() => {
                                    setShowCreateModal(false)
                                    setShowUpdateModal(false)
                                    setShowMenuOptions(false)
                                    setError({ error: false, message: "" })
                                    setSelectedSchedule(null)
                                }} backgroundColor={constants.color.lightGreen} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Modal visible={showMenuOptions} animationType='slide' transparent={true} >
                <Pressable style={styles.optionsModalBackground} onPress={() => setShowMenuOptions(false)}>
                    <View style={styles.optionsModalContainer}>
                        <View>
                            <Pressable android_ripple={{ color: "#ddd" }} style={{ padding: 20, paddingTop: 20, flexDirection: "row", alignItems: "center", gap: 10 }} onPress={() => {
                                setShowUpdateModal(true)
                                setScheduleFormInputs({ title: selectedSchedule.title, target: selectedSchedule.target });
                                setTempBiblicQuotesList(selectedSchedule.biblic_quotes);
                                setTempBiblicRefsList(selectedSchedule.biblic_refs);
                            }}>
                                <SimpleLineIcons name='pencil' color="black" size={20} />
                                <Text style={{ fontSize: 16 }}>Editar</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Pressable android_ripple={{ color: "#ddd" }} style={{ padding: 20, paddingTop: 20, flexDirection: "row", alignItems: "center", gap: 10 }} onPress={deleteSelectedScheduleHandler}>
                                <SimpleLineIcons name='trash' color="black" size={20} />
                                <Text style={{ fontSize: 16 }}>Eliminar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            {showMenuOptions && <Pressable onPress={() => showScheduleMenu(false)} style={{ width: "100%", height: "100%", backgroundColor: "#00000055", position: "absolute", top: 0 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        color: "#aaa",
        marginBottom: 10,
        width: "60%",
        textAlign: "center"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#555"
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
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
    itemContainer: {
        backgroundColor: constants.color.lightGreen,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 3,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
});

export default ScheduleScreen;


// Preguntar a ChatGPT por optimizar mi codigo