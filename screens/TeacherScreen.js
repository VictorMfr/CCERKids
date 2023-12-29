import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import ListItems from '../components/ListItems';
import { useTeacher } from '../context/TeacherContextProvider';
import { MenuOptionsModal, XYCenteredFullSize } from '../components/UI';
import CreateAndUpdateModalForm from '../components/CreateAndUpdateModalForm';
import constants from '../constants';





const TeacherScreen = () => {

    // States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [error, setError] = useState({error: false, message: ""});
    const [newTeacher, setNewTeacher] = useState({ name: '', lastName: '', sex: '', id: '' });


    // Custom Hooks
    const {
        showMenuOptions,
        setShowMenuOptions,
        selectedTeacher,
        setSelectedTeacher,
        teachers,
        setTeachers
    } = useTeacher();



    const updateTeacherHandler = async () => {

        if (!newTeacher.name || !newTeacher.lastName || !newTeacher.sex) {
            return setError({ error: true, message: "Llene todos los datos para continuar"})
        }

        const updatedTeachersList = teachers.map(teacher => {

            const condition = teacher.id === selectedTeacher.id;
            return condition ? newTeacher : teacher;
        })

        await AsyncStorage.setItem('teachers', JSON.stringify(updatedTeachersList));

        setTeachers(updatedTeachersList);
        setNewTeacher({ name: '', lastName: '', sex: '', id: '' })
        closeUpdateModal();
    }




    useEffect(() => {
        const getTeachersFromStorage = async () => {
            try {
                const storedTeachers = await AsyncStorage.getItem('teachers');
                if (storedTeachers) {
                    const parsedTeachers = JSON.parse(storedTeachers);
                    setTeachers(parsedTeachers);
                }
            } catch (error) {
                console.error('Error retrieving teachers from AsyncStorage:', error);
            }
        };

        setShowMenuOptions(false)
        getTeachersFromStorage();
    }, []);

    const closeUpdateModal = () => {
        setShowMenuOptions(false);
        setShowUpdateModal(false);
    }

    const displayUpdateModalWithLoadedData = () => {
        setShowUpdateModal(true);
        setNewTeacher({
            name: selectedTeacher.name,
            lastName: selectedTeacher.lastName,
            sex: selectedTeacher.sex
        });
    }

    const addTeacherHandler = async () => {
        try {

            if (!newTeacher.name || !newTeacher.lastName || !newTeacher.sex) {
                return setError({ error: true, message: "Llene todos los datos para continuar"})
            }

            const updatedTeachersList = [...teachers, {...newTeacher, id: new Date().getTime()}];
            setTeachers(updatedTeachersList);

            await AsyncStorage.setItem('teachers', JSON.stringify(updatedTeachersList));

            setShowCreateModal(false);
            setNewTeacher({ name: '', lastName: '', sex: ''}); // Limpiar el formulario
        } catch (error) {
            console.error('Error adding teacher:', error);
        }
    };
    


    const deleteTeacherHandler = async () => {

        try {
            const teachersList = await AsyncStorage.getItem('teachers');
            const parsedObject = JSON.parse(teachersList);
            const updatedTeachersList = parsedObject.filter(teacher => teacher.id !== selectedTeacher.id)

            await AsyncStorage.setItem('teachers', JSON.stringify(updatedTeachersList));
            setTeachers(updatedTeachersList);
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }


        setSelectedTeacher({});
        setShowMenuOptions(false);
    }

    const renderList = (teachers.length) === 0 ?
        <Text style={styles.title}>No hay datos, comience a agregar pulsando "+"</Text>
        : <ListItems listData={teachers} metadataItemName={"Maestro"} />

    
    const menuOptions = [
        {
            title: "Editar",
            icon: "pencil",
            action: displayUpdateModalWithLoadedData
        },
        {
            title: "Eliminar",
            icon: "trash",
            action: deleteTeacherHandler
        }
    ]

    const modalTitle = showUpdateModal ? 'Editar Maestro': 'Añadir Maestro';
    const visibilityCondition = showCreateModal || showUpdateModal;

    return (
        <XYCenteredFullSize>

            {renderList}

            <CreateAndUpdateModalForm
                controllersColor={constants.color.lightBlue}
                visible={visibilityCondition}
                modalTitle={modalTitle}
                CUActionsHandlers={[addTeacherHandler, updateTeacherHandler]}
                showCreateModalControllers={[showCreateModal, setShowCreateModal]}
                showUpdateModalControllers={[showUpdateModal, setShowUpdateModal]}
                formControllers={[ newTeacher, setNewTeacher ]}
                menuOptionsModalControllers={[showMenuOptions, setShowMenuOptions]}
                errorControllers={[error, setError]}
            >

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={newTeacher.name}
                    onChangeText={text => {
                        setNewTeacher({ ...newTeacher, name: text })
                        setError({error: false, message: ''})
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={newTeacher.lastName}
                    onChangeText={text => {
                        setNewTeacher({ ...newTeacher, lastName: text })
                        setError({error: false, message: ''})
                    }}
                />

                <View style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginBottom: 10 }}>
                    <Picker
                        selectedValue={newTeacher.sex}
                        onValueChange={(itemValue) =>
                            setNewTeacher({ ...newTeacher, sex: itemValue })
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

export default TeacherScreen;
