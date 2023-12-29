import React, { useContext, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HelpersProvider = React.createContext();

export const useHelper = () => {
    const helper = useContext(HelpersProvider)
    return helper;
}

const HelperContextProvider = ({ children }) => {

    const [showMenuOptions, setShowMenuOptions] = useState(false);
    const [selectedHelper, setSelectedHelper] = useState();
    const [helpers, setHelpers] = useState([]);

    const getHelpers = async () => {
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

    const value = {
        getHelpers,
        helpers,
        setHelpers,
        selectedHelper,
        setSelectedHelper,
        showMenuOptions,
        setShowMenuOptions
    }


    return (
        <HelpersProvider.Provider value={value}>
            {children}
        </HelpersProvider.Provider>
    )
}

export default HelperContextProvider;