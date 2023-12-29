import React from "react";
import { View, StyleSheet, Text, Modal  } from "react-native";
import constants from "../constants";
import FloatingAddButton from "./FloatingAddButton";
import { XYCenteredFullSize, Box, ButtonRipple } from "./UI";

const CreateAndUpdateModalForm = ({  errorControllers, menuOptionsModalControllers, formControllers, showCreateModalControllers, showUpdateModalControllers, modalTitle, children, CUActionsHandlers, controllersColor = constants.color.lightBlue }) => {

    const [create, update] = CUActionsHandlers;

    const [showCreateModal, setShowCreateModal] = showCreateModalControllers;
    const [showUpdateModal, setShowUpdateModal] = showUpdateModalControllers;
    const [showMenuOptions, setShowMenuOptions] = menuOptionsModalControllers;
    const [error, setError] = errorControllers;

    const [form, setForm ] = formControllers; 

    const closeAllModals = () => {
        setShowCreateModal(false)
        setShowUpdateModal(false)
        setShowMenuOptions(false)
        setError({error: false, message: ''})
        setForm({})
    }

    const styles = StyleSheet.create({
        title: {
            fontSize: 16,
            color: "#aaa",
            marginBottom: 10,
            width: "60%",
            textAlign: "center"
        },
        formTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: "#555"
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    })

    return (
        <>
            <Modal
                visible={showCreateModal || showUpdateModal}
                animationType="fade"
                transparent={true}
            >
                <XYCenteredFullSize alterStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <Box>
                        <Text style={styles.formTitle}>{modalTitle}</Text>
                        {error.error && <Text style={{color: "red", marginBottom: 10}}>{error.message}</Text>}

                        { children }

                        <View style={styles.buttonContainer}>
                            <ButtonRipple 
                                text={showUpdateModal ? "Actualizar" : "Agregar"} 
                                onPress={showUpdateModal ? update : create} 
                                backgroundColor={controllersColor} />
                            <ButtonRipple 
                                text={"Cancelar"} 
                                onPress={closeAllModals} 
                                backgroundColor={controllersColor} />
                        </View>
                    </Box>
                </XYCenteredFullSize>
            </Modal>

            <FloatingAddButton
                onPressed={() => setShowCreateModal(true)}
                color={controllersColor} />
        </>

    )
}

export default React.memo(CreateAndUpdateModalForm);