import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './src/components/AppNavigation';
import { UserInactivityProvider } from './src/components/UserInactivity';
import { useEffect } from 'react';

export default function App() {

  return (
    // <StatusBar style='dark' backgroundColor='white' />
    <AppNavigation/>
    // <UserInactivityProvider>
    // </UserInactivityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
