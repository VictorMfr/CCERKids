import React from 'react';
import NavMatrixElement from '../components/NavMatrixElement';
import { XYCenteredFullSize, FlexDirection } from "../components/UI";


const screensList = [
    [
        {
            screenName: "Teacher",
            optionTitle: "Maestros",
            backgroundColor: "#34A2F7",
            icon: "people"
        },
        {
            screenName: "Helper",
            optionTitle: "Auxiliares",
            backgroundColor: "#E9112E",
            icon: "people"
        }
    ],
    [
        {
            screenName: "Scheduler",
            optionTitle: "Planificador",
            backgroundColor: "#31E981",
            icon: "clock"
        },

    ],

]



function HomeScreen({ navigation }) {

    return (
        <XYCenteredFullSize>
            {screensList.map((row, rowIndex) => (
                <FlexDirection direction={"row"} key={rowIndex} gap={10} alterStyle={{ marginVertical: 5 }}>
                    {row.map(({ screenName, backgroundColor, icon, optionTitle }) => (
                        <NavMatrixElement
                            goTo={() => navigation.push(screenName)}
                            text={optionTitle}
                            backgroundColor={backgroundColor}
                            iconName={icon}
                            key={optionTitle}
                        />
                    ))}
                </FlexDirection>
            ))}
        </XYCenteredFullSize>
    );
}

export default HomeScreen;
