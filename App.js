import * as React from 'react';
import { View } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TeacherScreen from './screens/TeacherScreen';
import TeacherContextProvider from './context/TeacherContextProvider';
import HelperScreen from './screens/HelperScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import { StatusBar } from 'expo-status-bar';
import HelperContextProvider from './context/HelperContextProvider';
import ScheduleContextProvider from './context/ScheduleContextProvider';
import ScheduleMakerScreen from './screens/ScheduleMakerScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar style='light' />
      <TeacherContextProvider>
        <HelperContextProvider>
          <ScheduleContextProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{
                headerStyle: {
                  backgroundColor: '#6CCDF6',
                }
              }}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio", headerTintColor: "white" }} />
                <Stack.Screen name="Teacher" component={TeacherScreen} options={{ title: "Maestros", headerTintColor: "white" }} />
                <Stack.Screen name="Helper" component={HelperScreen} options={{ title: "Auxiliares", headerTintColor: "white", headerStyle: { backgroundColor: "#E9112E" } }} />
                <Stack.Screen
                  name="Scheduler"
                  component={ScheduleScreen}
                  options={{
                    title: "Planificaciones",
                    headerTintColor: "white",
                    headerStyle: {
                      backgroundColor: "#31E981"
                    },
                  }} />
                <Stack.Screen
                  name="ScheduleMaker"
                  component={ScheduleMakerScreen}
                  options={{
                    title: "Planificador",
                    headerTintColor: "white",
                    headerStyle: {
                      backgroundColor: "#31E981"
                    },
                  }} />
              </Stack.Navigator>
            </NavigationContainer>
          </ScheduleContextProvider>
        </HelperContextProvider>
      </TeacherContextProvider>
    </View>
  );
}

export default App;
