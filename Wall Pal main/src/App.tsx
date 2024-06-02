import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './Pages/StartScreen';
import DetailScreen from './Pages/DetailScreen';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainScreen from './Pages/MainScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Splash" component={StartScreen} />
            <Stack.Screen name="Home" component={MainScreen} />
            <Stack.Screen name="Details" component={DetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
  );
}
