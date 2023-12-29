import React, { useContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SchedulesProvider = React.createContext();

export const useSchedule = () => {
    const schedule = useContext(SchedulesProvider)
    return schedule;
}

const ScheduleContextProvider = ({ children }) => {

    const [showMenuOptions, setShowMenuOptions] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [showHeaderOptions, setShowHeaderOptions] = useState(false);
    const [showDetailsSchedule, setShowDetailsSchedule] = useState(null);
    const [schedules, setSchedules] = useState([]);


    const setNewSchedules = async (updatedSchedulesList) => {
        try {
            await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedulesList));
            setSchedules(updatedSchedulesList);
        } catch (error) {
            console.error('Error adding new schedule from AsyncStorage:', error);
        }
    }

    const getSchedules = async () => {
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

    const value = {
        setNewSchedules,
        getSchedules,
        showHeaderOptions,
        setShowHeaderOptions,
        schedules,
        setSchedules,
        selectedSchedule,
        setSelectedSchedule,
        showMenuOptions,
        setShowMenuOptions,
        showDetailsSchedule,
        setShowDetailsSchedule
    }


    return (
        <SchedulesProvider.Provider value={value}>
            {children}
        </SchedulesProvider.Provider>
    )
}

export default ScheduleContextProvider;