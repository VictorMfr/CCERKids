import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, Modal, Clipboard } from 'react-native';
import { ButtonRipple } from '../components/UI';
import { SimpleLineIcons } from '@expo/vector-icons';
import constants from '../constants';
import { useTeacher } from "../context/TeacherContextProvider";
import { useHelper } from "../context/HelperContextProvider";
import { useSchedule } from "../context/ScheduleContextProvider";



const ScheduleMaker = () => {
    const [schedule, setSchedule] = useState([]);
    const [numSchedules, setNumSchedules] = useState(0);
    const [resultsModal, setResultModal] = useState(false);
    const [isClipped, setIsClipped] = useState(false);


    const [date, setDate] = useState('');

    const { teachers: teachersList, getTeachers } = useTeacher();
    const { helpers: helpersList, getHelpers } = useHelper();
    const { schedules: schedulesList, getSchedules } = useSchedule();


    useEffect(() => {
        getTeachers();
        getHelpers();
        getSchedules();
    }, [])


    const incrementNumSchedulesHandler = () => {
        setNumSchedules(prev => parseInt(prev, 10) + 1);
    }

    const decrementNumSchedulesHandler = () => {
        if (numSchedules != 0) {
            setNumSchedules(prev => parseInt(prev, 10) - 1);
        }
    }

    useEffect(() => {

        if (!numSchedules) {
            setNumSchedules(0)
        }

    }, [numSchedules])

    const BlurScheduleInputHandler = () => {
        if (!numSchedules || numSchedules < 0) {
            setNumSchedules(0)
        }
    }

    function shuffleArray(array) {
        let newArray = [...array]; // Crear una copia del array original
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Intercambiar elementos
        }
        return newArray; // Devolver el array mezclado
      }
      

    const assign = async () => {
        
        // Get the Helpers, Teachers and Planification list
        let teachers = teachersList.map(teacher => `${teacher.sex == "hombre" ? "Hno." : "Hna."} ${teacher.name} ${teacher.lastName}`)
        let helpers = helpersList.map(helper => `${helper.sex == "hombre" ? "Hno." : "Hna."} ${helper.name} ${helper.lastName}`)
        let schedules = schedulesList;

        // Initial Swap
        teachers = shuffleArray(teachers);
        helpers = shuffleArray(helpers);
        schedules = shuffleArray(schedules);

        let AssignedSchedules = [];

        for (let i = 0; i < numSchedules; i++) {
            let scheduleOne, scheduleTwo, teacherOne, teacherTwo, helperOne, helperTwo;

            // Take two schedules
            if (schedules.length > 2) {
                scheduleOne = schedules[0];
                scheduleTwo = schedules[1];
                schedules = schedules.slice(2);
            } else if (schedules.length == 1) {
                scheduleOne = schedules[0];
                schedules = schedules.slice(1);

                schedules = shuffleArray(schedulesList);

                scheduleTwo = schedules[0];
                schedules = schedules.slice(1);
            } else {
                schedules = shuffleArray(schedulesList);

                if (schedules.length >= 2) {
                    scheduleOne = schedules[0];
                    scheduleTwo = schedules[1];
                    schedules = schedules.slice(2);
                    if (schedules.length == 0) {
                        schedules = shuffleArray(schedulesList);
                    }
                } else if (schedules.length == 1) {
                    scheduleOne = schedules[0];
                    scheduleTwo = schedules[0];
                    schedules = schedules.slice(1)
                    schedules = shuffleArray(schedulesList);
                } else {
                    console.log("error, no hay ni siquiera una planificacion")
                }

            }

            // Take Two teachers
            if (teachers.length >= 2) {
                teacherOne = teachers[0];
                teacherTwo = teachers[1];
                teachers = teachers.slice(2);
            } else if (teachers.length == 1) {
                teacherOne = teachers[0];
                teachers = teachers.slice(1);

                if (teachersList.every(teacher => !teachers.includes(teacher))) {
                    teachers = shuffleArray(teachersList.map(teacher => `${teacher.sex == "hombre" ? "Hno. " : "Hna. "}${teacher.name} ${teacher.lastName}`));
                }

                teacherTwo = teachers[0];
                teachers = teachers.slice(1);
            } else {
                if (teachersList.every(teacher => !teachers.includes(teacher))) {
                    teachers = shuffleArray(teachersList.map(teacher => `${teacher.sex == "hombre" ? "Hno. " : "Hna. "}${teacher.name} ${teacher.lastName}`));
                }

                teacherOne = teachers[0];
                teacherTwo = teachers[1];
                teachers = teachers.slice(2);
            }

            // Take Two helpers
            if (helpers.length >= 2) {
                helperOne = helpers[0];
                helperTwo = helpers[1];
                helpers = helpers.slice(2);
            } else if (helpers.length == 1) {
                helperOne = helpers[0];
                helpers = helpers.slice(1);

                if (helpersList.every(helper => !helpers.includes(helper))) {
                    helpers = shuffleArray(helpersList.map(helper => `${helper.sex == "hombre" ? "Hno. " : "Hna. "}${helper.name} ${helper.lastName}`));
                }

                helperTwo = helpers[0];
                helpers = helpers.slice(1);
            } else {
                if (helpersList.every(helper => !helpers.includes(helper))) {
                    helpers = shuffleArray(helpersList.map(helper => `${helper.sex == "hombre" ? "Hno. " : "Hna. "}${helper.name} ${helper.lastName}`));
                }

                helperOne = helpers[0];
                helperTwo = helpers[1];
                helpers = helpers.slice(2);
            }

            const finalSchedule = {
                bigGroup: {
                    teacher: teacherOne,
                    title: scheduleOne.title,
                    target: scheduleOne.target,
                    biblic_refs: scheduleOne.biblic_refs,
                    biblic_quotes: scheduleOne.biblic_quotes
                },
                smallGroup: {
                    teacher: teacherTwo,
                    title: scheduleTwo.title,
                    target: scheduleTwo.target,
                    biblic_refs: scheduleTwo.biblic_refs,
                    biblic_quotes: scheduleTwo.biblic_quotes,
                    helpers: [helperOne, helperTwo]
                }
            }

            AssignedSchedules.push(finalSchedule);
        }

        setSchedule(AssignedSchedules);
    };


    const agregarSemanas = (fechaInicial, numSemanas) => {
        var partes = fechaInicial.split('/');
        var fecha = new Date(partes[2], partes[1] - 1, partes[0]);
        if (numSemanas > 0) {
            fecha.setDate((fecha.getDate() + numSemanas * 7).toString());
        }
        return fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    }


    const ConvertSchedulesListToString = (list) => {
        let resultado = '';
        for (let i = 0; i < list.length; i++) {
            let bigGroup = list[i].bigGroup;
            let smallGroup = list[i].smallGroup;
            resultado += '*Centro Cristiano Embajadores del Rey*\n';
            resultado += '*Escuela Dominical*\n\n';
            resultado += '📅 Fecha: ' + agregarSemanas(date, i) + '\n\n';
            resultado += '*Grupos: Guerreros de Josué y Valientes de Gedeón*\n\n';
            resultado += `${bigGroup.teacher.includes("Hno.")? "👨‍🏫 Maestro" : "👩‍🏫 Maestra"}: ` + bigGroup.teacher + '\n';
            resultado += '✅Tema: ' + bigGroup.title + '\n';
            resultado += '📘Cita biblica: ' + bigGroup.biblic_refs.join(', ') + '\n';
            resultado += '🎯Objetivo: ' + bigGroup.target + '\n';
            resultado += '📗Citas complementarias:\n' + bigGroup.biblic_quotes.join('\n') + '\n\n';
            resultado += '*Grupos: Obedientes de Josías y Adoradores de David*\n\n';
            resultado += `${smallGroup.teacher.includes("Hno.")? "👨‍🏫 Maestro" : "👩‍🏫 Maestra"}: ` + smallGroup.teacher + '\n';
            resultado += '✅Tema: ' + smallGroup.title + '\n';
            resultado += '📘Cita bíblica: ' + smallGroup.biblic_refs.join(', ') + '\n';
            resultado += '🎯Objetivo: ' + smallGroup.target + '\n';
            resultado += '📗Citas complementarias:\n' + smallGroup.biblic_quotes.join('\n') + '\n\n';
            resultado += '🤝 Auxiliares: ' + smallGroup.helpers.join(', ') + '\n\n';
        }
        return resultado;
    }


    const addToClipBoard = () => {

        Clipboard.setString(ConvertSchedulesListToString(schedule));
        setIsClipped(true);
    }

    const lista = schedule.map((s, i) => (
        <View key={i} style={{ backgroundColor: constants.color.lightGreen, width: "100%", height: "auto", marginBottom: 30, elevation: 5 }}>
            <Text style={{ paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, marginBottom: 10, color: "white", fontWeight: "700", backgroundColor: "#1C9651" }}>Planificación {agregarSemanas(date, i)}</Text>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <Text style={{ color: "#555", fontWeight: "600", fontSize: 15, textAlign: "center" }}>Centro Cristiano Embajadores del Rey</Text>
                <Text style={{ color: "#555", fontWeight: "600", marginBottom: 20, textAlign: "center" }}>Escuela Dominical</Text>


                {/* Grupos Grandes */}

                <Text style={{ color: "#555", fontWeight: "600", paddingHorizontal: 5, marginBottom: 20 }}>Grupo: Guerreros de Josué y Valientes de Gedeón</Text>


                <Text style={{ color: "#1C9651" }}><Text style={{ color: "#555", fontWeight: "600" }}>{s.bigGroup.teacher.includes("Hno. ") ? "👨‍🏫 Maestro: " : "👩‍🏫 Maestra: "}</Text> {s.bigGroup.teacher}</Text>
                <Text style={{ color: "#1C9651" }}>⭐ <Text style={{ color: "#555", fontWeight: "600" }}>Tema: </Text>{s.bigGroup.title}.</Text>
                <Text style={{ color: "#1C9651", marginBottom: 5 }}>🎯 <Text style={{ color: "#555", fontWeight: "600" }}>Objetivo: </Text>{s.bigGroup.target}.</Text>
                <Text style={{ color: "#1C9651" }}>📘 <Text style={{ color: "#555", fontWeight: "600" }}>Citas bíblicas: </Text>{s.bigGroup.biblic_refs.join(", ")}.</Text>
                <Text style={{ color: "#1C9651", marginBottom: 20 }}>📗 <Text style={{ color: "#555", fontWeight: "600" }}>Citas complementarias: </Text>{s.bigGroup.biblic_quotes.join(", ")}.</Text>


                {/* Grupos menores */}


                <Text style={{ color: "#555", fontWeight: "600", paddingHorizontal: 5, marginBottom: 20 }}>Grupo: Obedientes de Josías y Adoradores de David</Text>



                <Text style={{ color: "#1C9651" }}><Text style={{ color: "#555", fontWeight: "600" }}>{s.smallGroup.teacher.includes("Hno. ") ? "👨‍🏫 Maestro: " : "👩‍🏫 Maestra: "}</Text> {s.smallGroup.teacher}</Text>
                <Text style={{ color: "#1C9651" }}>⭐ <Text style={{ color: "#555", fontWeight: "600" }}>Tema: </Text>{s.smallGroup.title}.</Text>
                <Text style={{ color: "#1C9651", marginBottom: 5 }}>🎯 <Text style={{ color: "#555", fontWeight: "600" }}>Objetivo: </Text>{s.smallGroup.target}.</Text>
                <Text style={{ color: "#1C9651" }}>📘 <Text style={{ color: "#555", fontWeight: "600" }}>Citas bíblicas: </Text>{s.smallGroup.biblic_refs.join(", ")}.</Text>
                <Text style={{ color: "#1C9651", marginBottom: 20 }}>📗 <Text style={{ color: "#555", fontWeight: "600" }}>Citas complementarias: </Text>{s.smallGroup.biblic_quotes.join(", ")}.</Text>

                <Text style={{ color: "#1C9651" }}>🤝 <Text style={{ color: "#555", fontWeight: "600" }}>Auxiliares: </Text>{s.smallGroup.helpers.join(", ")}.</Text>
            </View>
        </View >
    ))





    return (

        <View style={{ flex: 1 }}>
            <Modal visible={resultsModal} transparent={true} animationType='fade'>

                <View style={{ backgroundColor: "#00000055", flex: 1 }}>

                    <View style={{ justifyContent: "center", alignItems: "center", margin: 20, padding: 10, backgroundColor: "white", flex: 1 }}>

                        <View style={{ alignItems: "center", flex: 1 }}>
                            <ScrollView style={{ flex: 1, marginBottom: 10 }} contentContainerStyle={{ alignItems: "center" }}>
                                {lista}
                            </ScrollView>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <ButtonRipple backgroundColor={constants.color.lightGreen} text={"Cerrar"} onPress={() => {
                                    setIsClipped(false)
                                    setResultModal(false)
                                    setSchedule([]);
                                }} />
                                <ButtonRipple backgroundColor={constants.color.lightGreen} text={<View style={{ flexDirection: "row" }}><Text style={{ color: "white" }}>{isClipped ? "Copiado" : "Copiar"}</Text><Text>  </Text><SimpleLineIcons name={isClipped ? 'check' : 'doc'} color={"white"} size={20} /></View>} onPress={addToClipBoard} />
                            </View>

                        </View>

                    </View>


                </View>

            </Modal>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 20 }} >
                    <View style={{ marginTop: 50, alignItems: "center", }}>
                        <SimpleLineIcons name='event' size={50} color={"white"} style={{ marginBottom: 10, borderRadius: 25, elevation: 5, padding: 20, backgroundColor: constants.color.lightGreen }} />
                    </View>

                    <Text style={{ textAlign: "center", marginTop: 50, width: 150, alignSelf: "center", color: "#555" }}>Número de Planificaciones</Text>
                    <View style={{ marginBottom: 50, marginTop: 20, alignItems: 'center', flexDirection: "row", justifyContent: "center", gap: 10 }}>
                        <View style={{ borderRadius: 40, backgroundColor: constants.color.lightGreen }}>
                            <Pressable onPress={decrementNumSchedulesHandler} android_ripple={{ color: "#ddd", radius: 20 }} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontWeight: "500", fontSize: 30, color: "white" }}>-</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            value={numSchedules.toString()}
                            onChangeText={(number) => setNumSchedules(parseInt(number, 10))}
                            keyboardType="numeric"
                            maxLength={2}
                            style={{ fontSize: 30, elevation: 0, width: 60, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#ddd", textAlign: "center" }}
                            onBlur={BlurScheduleInputHandler}
                        />
                        <View style={{ borderRadius: 40, backgroundColor: constants.color.lightGreen }}>
                            <Pressable onPress={incrementNumSchedulesHandler} android_ripple={{ color: "#ddd", radius: 20 }} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 30, color: "white" }}>+</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Text style={{ textAlign: "center", width: 150, alignSelf: "center", color: "#555" }}>Fecha de Inicio</Text>
                    <View style={{ marginBottom: 10, marginTop: 20, alignItems: 'center', flexDirection: "row", justifyContent: "center", gap: 10 }}>
                        <TextInput
                            style={{ fontSize: 30, elevation: 0, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#ddd", textAlign: "center" }}
                            onChangeText={text => setDate(text)}
                            value={date}
                            placeholder="dd/mm/yyyy"
                        />
                    </View>


                    <View style={{ alignItems: "center", marginTop: 20 }}>
                        <ButtonRipple onPress={() => {
                            if (numSchedules === 0 || date === '') {
                                return
                            }
                            setResultModal(true)
                            assign()
                        }} alterStyle={{ backgroundColor: constants.color.lightGreen, borderRadius: 25, width: 100, height: 100 }} text={<SimpleLineIcons style={{ position: "absolute" }} name='control-play' color={"white"} size={40} />} />
                    </View>

                </ScrollView>
            </View >
        </View>

    );
};

export default ScheduleMaker;
