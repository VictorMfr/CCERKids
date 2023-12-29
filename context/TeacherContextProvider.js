import React, { useContext, useState } from "react";
import { View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const TeachersProvider = React.createContext();

export const useTeacher = () => {
    const teacher = useContext(TeachersProvider)
    return teacher;
}

const TeacherContextProvider = ({ children }) => {

    const [showMenuOptions, setShowMenuOptions] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState();
    const [teachers, setTeachers] = useState([]);

    

    const getTeachers = async () => {
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

    const value = {
        getTeachers,
        teachers,
        setTeachers,
        selectedTeacher,
        setSelectedTeacher,
        showMenuOptions,
        setShowMenuOptions
    }


    return (
        <TeachersProvider.Provider value={value}>
            {children}
        </TeachersProvider.Provider>
    )
}

export default TeacherContextProvider;