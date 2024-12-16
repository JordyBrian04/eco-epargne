import { View, Text, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SQLiteProvider, useSQLiteContext} from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Feather,Ionicons } from '@expo/vector-icons';

import Connexion from '../screens/Connexion';
import Code from '../screens/Code';
import LockScreen from '../screens/LockScreen';
import Page from './(modals)/white';
import Home from '../screens/(tabs)/Home';
import Compte from '../screens/(tabs)/Compte';
import Parametre from '../screens/(tabs)/Parametre';
import Notifications from '../screens/(tabs)/Notifications';
import DetailCompte from '../screens/DetailCompte';
import Transaction from '../screens/Transaction';
import ResultatTransaction from '../screens/ResultatTransaction';
import Crypto from '../screens/Crypto';
import ChoixReseau from '../screens/ChoixReseau';
import ChoixCompte from '../screens/ChoixCompte';
import Transfert from '../screens/Transfert';
import { storeNumCompte } from '../services/AsyncStorage';
import { MyTabBar } from './TabBar';

const Stack = createNativeStackNavigator();
const TabStack = createBottomTabNavigator()
const db = SQLite.openDatabaseAsync('local.db');

const AppNavigation = () => {

  // const database = useSQLiteContext();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);;
  // const [initialRoute, setInitialRoute] = useState<'Connexion' | 'LockScreen'>('Connexion');
  
  const initDatabase = async () => {
    try {
      (await db).execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS user_local (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          num_compte TEXT NOT NULL,
          nom_complet TEXT NOT NULL,
          numero TEXT NOT NULL,
          solde INTEGER DEFAULT 0,
          sta INTEGER DEFAULT 0,
          mdp TEXT
        );
      `);
      //ALTER TABLE user_local ADD sta INTEGER DEFAULT 0;
      //UPDATE user_local SET sta=1;
      console.log('Database created')
  
      try {
        // await (await db).runAsync('DELETE FROM user_local')
        // await (await db).runAsync("UPDATE user_local SET mdp='1234'")
        const get_user:any = await (await db).getFirstAsync('SELECT * FROM user_local WHERE sta = 1');
        console.log('userdata ',get_user)
        if(get_user)
          {
          await storeNumCompte(get_user?.num_compte)
          return 'LockScreen'
        }
        else
        {
          return 'Connexion'
        }
        console.log('userdata ',get_user)
        setInitialRoute(get_user ? 'LockScreen' : 'Connexion');
      } catch (error) {
        console.log('Error : ', error);
        return 'Connexion'
      }
    } catch (error) {
      console.log('Database not created : ', error);
      return 'Connexion'
    }
  } 

  const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Chargement...</Text>
    </View>
  );

  useEffect(() => {
    const initialize = async () => {
      const route = await initDatabase();
      console.log('route : ', route)
      setInitialRoute(route);
    };
    initialize();
  }, [])

  if (!initialRoute) {
    // Afficher l'écran de chargement tant que l'initialisation n'est pas terminée
    return <LoadingScreen />;
  }

  const screenOptions = ({route}:any) => ({
    tabBarIcon : ({focused}:any) => {
      let icon: any = null;
      const size = 24
      const color = focused ? "#1e40af" : "#838383";
    
      switch (route.name) {
        case "Home":
          icon = <Feather name="home" size={24} color={color} />
          // <View className='p-1 rounded-xl bg-white' style={{borderWidth: 1, borderColor: '#007AFF'}}>
          //     <Image source={require('../assets/home.png')} className='rounded-lg bg-contain'/>
          // </View>;
          break;
        case "Compte":
          icon = <Ionicons name="wallet-outline" size={24} color={color} />
          // <View className='p-1 rounded-xl bg-white' style={{borderWidth: 1, borderColor: '#007AFF'}}>
          //     <Image source={require('../assets/security-scan.png')} className='rounded-lg bg-contain' tintColor={'#007AFF'}/>
          //   </View>;
          break;
        case "Notifications":
          icon = <Feather name="bell" size={24} color={color} />
        //   <View className='p-1 rounded-xl bg-white' style={{borderWidth: 1, borderColor: '#007AFF'}}>
        //       <Image source={require('../assets/setting.png')} className='rounded-lg bg-contain' tintColor={'#007AFF'}/>
        // </View>;
          break;
        case "Parametre":
          icon = <Feather name="settings" size={24} color={color} />
        //   <View className='p-1 rounded-xl bg-white' style={{borderWidth: 1, borderColor: '#007AFF'}}>
        //       <Image source={require('../assets/setting.png')} className='rounded-lg bg-contain' tintColor={'#007AFF'}/>
        // </View>;
          break;
      }
    
      return icon;
    }, 
  
    tabBarActiveTintColor: '#3b82f6',
    tabBarInactiveTintColor: '#5C5E5F',
    tabBarLabelStyle: {
      fontSize: 13,
      display: 'none'
    },
    tabBarStyle: {
      backgroundColor: "#ffffff",
      width: 'full',
      height: Platform.OS === 'android' ? 50 : 85,
      // borderRadius: 25,
      // alignSelf:"center",
      // marginBottom: 5,
    },
  
  })

  const TabStackScreens = () => {
    // screenOptions={screenOptions}
    return (
      <TabStack.Navigator tabBar={props => <MyTabBar {...props} />} >
        <TabStack.Screen options={{ headerShown: false }} name="Home" component={Home} />
        <TabStack.Screen options={{ headerShown: false }} name="Compte" component={Compte}/>
        <TabStack.Screen options={{ headerShown: false }} name="Notifications" component={Notifications} />
        <TabStack.Screen options={{ headerShown: false }} name="Parametre" component={Parametre} />
      </TabStack.Navigator>
    )
  }

  return (
    // <SQLiteProvider databaseName='local.db' onInit={initDatabase}>
      <NavigationContainer>
        {/* {initialRoute} */}
          <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen name="Connexion" component={Connexion} options={{headerShown: false, gestureEnabled: false}}/>
              <Stack.Screen name="Code" component={Code} options={{headerShown: false}}/>
              <Stack.Screen name="LockScreen" component={LockScreen} options={{headerShown: false, gestureEnabled: false}}/>
              <Stack.Screen name="Page" component={Page} options={{headerShown: false, animation:'none'}}/>
              <Stack.Screen options={{headerShown: false, gestureEnabled: false}} name="Tabs" component={TabStackScreens}/>
              <Stack.Screen name="DetailCompte" component={DetailCompte} options={{headerShown: false}}/>
              <Stack.Screen name="Transactions" component={Transaction} options={{headerShown: false}}/>
              <Stack.Screen name="Crypto" component={Crypto} options={{headerShown: false}}/>
              <Stack.Screen name="ChoixReseau" component={ChoixReseau} options={{headerShown: false}}/>
              <Stack.Screen name="ChoixCompte" component={ChoixCompte} options={{headerShown: false}}/>
              <Stack.Screen name="Transfert" component={Transfert} options={{headerShown: false}}/>
              <Stack.Screen name="ResultatTransaction" component={ResultatTransaction} options={{headerShown: false, gestureEnabled: false}}/>
          </Stack.Navigator>
      </NavigationContainer>
    // {/* </SQLiteProvider> */}
  )
}

export default AppNavigation