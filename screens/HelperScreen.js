import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import ListItems from '../components/ListItems';
import { useHelper } from '../context/HelperContextProvider';

import { MenuOptionsModal, XYCenteredFullSize } from '../components/UI'
import CreateAndUpdateModalForm from '../components/CreateAndUpdateModalForm';
import constants from '../constants';



const HelperScreen = () => {

    // States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [error, setError] = useState({error: false, message: ""});
    const [newHelper, setNewHelper] = useState({ name: '', lastName: '', sex: '', id: '' });


    // Custom Hooks
    const {
        showMenuOptions,
        setShowMenuOptions,
        selectedHelper,
        setSelectedHelper,
        helpers,
        setHelpers
    } = useHelper();

    const updateHelperHandler = async () => {

        if (!newHelper.name || !newHelper.lastName || !newHelper.sex) {
            return setError({ error: true, message: "Llene todos los datos para continuar"})
        }

        const updatedHelpersList = helpers.map(helper => {

            const condition = helper.id === selectedHelper.id;
            return condition ? newHelper : helper;
        })

        await AsyncStorage.setItem('helpers', JSON.stringify(updatedHelpersList));
        setHelpers(updatedHelpersList);

        setNewHelper({ name: '', lastName: '', sex: '', id: '' });
        closeUpdateModal();
    }




    useEffect(() => {
        const getHelpersFromStorage = async () => {
            try {
                const storedHelpers = await AsyncStorage.getItem('helpers');
                if (storedHelpers) {
                    const parsedHelpers = JSON.parse(storedHelpers);
                    setHelpers(parsedHelpers);
                }
            } catch (error) {
                console.error('Error retrieving helpers from AsyncStorage:', error);
            }
        };

        setShowMenuOptions(false)
        getHelpersFromStorage();
    }, []);

    const closeUpdateModal = () => {
        setShowMenuOptions(false);
        setShowUpdateModal(false);
    }

    const displayUpdateModalWithLoadedData = () => {
        setShowUpdateModal(true);
        setNewHelper({
            name: selectedHelper.name,
            lastName: selectedHelper.lastName,
            sex: selectedHelper.sex
        });
    }

    const addHelperHandler = async () => {

        if (!newHelper.name || !newHelper.lastName || !newHelper.sex) {
            return setError({ error: true, message: "Llene todos los datos para continuar"})
        }

        try {

            const updatedHelpersList = [...helpers, {...newHelper, id: new Date().getTime()}];
            setHelpers(updatedHelpersList);

            await AsyncStorage.setItem('helpers', JSON.stringify(updatedHelpersList));

            setShowCreateModal(false);
            setNewHelper({ name: '', lastName: '', sex: ''}); // Limpiar el formulario
        } catch (error) {
            console.error('Error adding helper:', error);
        }
    };
    


    const deleteHelperHandler = async () => {

        try {
            const helpersList = await AsyncStorage.getItem('helpers');
            const parsedObject = JSON.parse(helpersList);
            const updatedHelpersList = parsedObject.filter(helper => helper.id !== selectedHelper.id)

            await AsyncStorage.setItem('helpers', JSON.stringify(updatedHelpersList));
            setHelpers(updatedHelpersList);
        } catch (error) {
            console.error('Error deleting helper:', error);
        }


        setSelectedHelper({});
        setShowMenuOptions(false);
    }

    const renderList = (helpers.length) === 0 ?
        <Text style={styles.title}>No hay datos, comience a agregar pulsando "+"</Text>
        : <ListItems listData={helpers} metadataItemName={"Auxiliar"} theme={constants.color.red}/>

    
    const menuOptions = [
        {
            title: "Editar",
            icon: "pencil",
            action: displayUpdateModalWithLoadedData
        },
        {
            title: "Eliminar",
            icon: "trash",
            action: deleteHelperHandler
        }
    ]

    const modalTitle = showUpdateModal ? 'Editar Auxiliar': 'Añadir Auxiliar';
    const visibilityCondition = showCreateModal || showUpdateModal;

    return (
        <XYCenteredFullSize>

            {renderList}

            <CreateAndUpdateModalForm
                controllersColor={constants.color.red}
                visible={visibilityCondition}
                modalTitle={modalTitle}
                CUActionsHandlers={[addHelperHandler, updateHelperHandler]}
                showCreateModalControllers={[showCreateModal, setShowCreateModal]}
                showUpdateModalControllers={[showUpdateModal, setShowUpdateModal]}
                formControllers={[ newHelper, setNewHelper ]}
                menuOptionsModalControllers={[showMenuOptions, setShowMenuOptions]}
                errorControllers={[error, setError]}
            >

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={newHelper.name}
                    onChangeText={text => setNewHelper({ ...newHelper, name: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={newHelper.lastName}
                    onChangeText={text => setNewHelper({ ...newHelper, lastName: text })}
                />

                <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginBottom: 10 }}>
                    <Picker
                        selectedValue={newHelper.sex}
                        onValueChange={(itemValue) =>
                            setNewHelper({ ...newHelper, sex: itemValue })
                        } mode='dropdown'>
                        <Picker.Item label='Seleccione Genero' color='#999' value={null} style={{ fontSize: 14 }} />
                        <Picker.Item label='Hombre' color='#999' value={"hombre"} style={{ fontSize: 14 }} />
                        <Picker.Item label='Mujer' color='#999' value={"mujer"} style={{ fontSize: 14 }} />
                    </Picker>
                </View>

            </CreateAndUpdateModalForm>
            <MenuOptionsModal
                visibilityController={[showMenuOptions, setShowMenuOptions]}
                options={menuOptions} />
        </XYCenteredFullSize>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: "#aaa",
        marginBottom: 10,
        width: "60%",
        textAlign: "center"
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
});

export default HelperScreen;
