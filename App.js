import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons} from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AuthNavigator from './screens/Auth/AuthNavigator';

import MainTabNavigator from './screens/Home/MainTabNavigator';


import firebase from './services/firebase.service';


import { DrawerContent } from './screens/Home/DrawerContent';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const containerRef = React.useRef();


  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        await Font.loadAsync({
          ionicons: Ionicons.font['ionicons'],
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  })

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef}>
          {
            isLoggedIn ? (
              <Drawer.Navigator initialRouteName="HomeDrawer" drawerContent={props=><DrawerContent {...props}/>} >
                <Drawer.Screen name="HomeDrawer" component={MainTabNavigator} />
              </Drawer.Navigator>
            ) : (
                <Stack.Navigator>
                  <Stack.Screen name="Auth" options={{ headerShown: false }} component={AuthNavigator} />
                </Stack.Navigator>
              )
          }
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
