// import { MMKV } from "react-native-mmkv";

import { useEffect, useRef } from "react";
import { AppState } from "react-native";

// let storage;
// if (__DEV__) {
//     storage = new MMKV({
//         id: 'UserInactivity',
//     });
// }

const LOCK_TIME = 3000;

export const UserInactivityProvider = ({children, navigation}:any) => {
    const appState = useRef(AppState.currentState)
    
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange)

        return () => {
            subscription.remove()
        }
    },[])

    const handleAppStateChange = (nextAppState:any) => {
        console.log('appState :', appState.current, nextAppState)

        if(nextAppState === 'inactive')
        {
            navigation.navigate('/Page');
        }
        else
        {
            navigation.goBack()
        }
        
        if(nextAppState === 'background')
        {
            recordStartTime();
        }else if(nextAppState === 'active' && appState.current.match(/background/)){
            //const elapsed = Date.now() - (storage.getNumer('startTime') || 0)

            // if(elapsed >= LOCK_TIME)
            // {
            //     navigation.navigate('/LockScreen');
            // }
        }
        appState.current = nextAppState
    }


    const recordStartTime = () => {
        // storage.set('startTime', Date.now());
    }
    return children;
}