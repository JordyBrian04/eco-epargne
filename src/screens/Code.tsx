import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import useCustomFonts from '../constants/FONTS';
import { StatusBar } from 'expo-status-bar';
import {Feather, AntDesign } from '@expo/vector-icons';
import { getUserDatas, storeNumCompte, storeUserDatas } from '../services/AsyncStorage';
import { OtpInput } from "react-native-otp-entry";
import  {db} from '../db'
import { utilisateur, temp } from '../db/schema';
import { eq, sql, and, count, desc } from 'drizzle-orm';
import { changeAccount } from '../services/Requests';

const Code = ({navigation}:any) => {

    const [loading, setLoading] = useState(false)
    const [minutes, setMinutes] = useState(2)
    const [seconds, setSeconds] = useState(0);
    const [stopTimer, setStopTimer] = useState(false);


    const fontsLoaded = useCustomFonts();

    if (!fontsLoaded) {
        return undefined; // Render a loading indicator or something else
    }



    // useEffect(() => {

    //     const sendCode = async () => {
    //         await getUserDatas()
    //         .then(async (user) => {
    //             if(user.length > 0)
    //             {

    //             }
    //         })
    //         .catch((error) => {
    //             alert(error)
    //         })
    //     } 

    //     sendCode();
    // }, [])

    // useEffect(() => {
    //     if(!stopTimer){
  
    //       const interval = setInterval(() => {
    //         if (seconds > 0) {
    //           setSeconds(seconds - 1);
    //         }
      
    //         if (seconds === 0) {
    //           if (minutes === 0) {
    //             clearInterval(interval);
    //             setStopTimer(true)
    //             // Alert.alert('OTP', 'Le temps est ecoulé', [
    //             //   {
    //             //     text: 'Cancel',
    //             //     onPress: () => console.log('Cancel Pressed'),
    //             //     style: 'cancel',
    //             //   },
    //             //   {text: 'OK', onPress: () => goBack()},
    //             // ]);
    //           } else {
    //             setSeconds(59);
    //             setMinutes(minutes - 1);
    //           }
    //         }
    //       }, 1000);
  
  
    //       return () => {
    //         clearInterval(interval);
    //       };
    //     }
    
    //   }, [seconds]);

    useEffect(() => {
        if (stopTimer) return;
    
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else if (minutes > 0) {
                    setMinutes((prevMinutes) => prevMinutes - 1);
                    return 59;
                } else {
                    clearInterval(interval);
                    setStopTimer(true);
                    return 0;
                }
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, [minutes, stopTimer]);

    const handleCode = async (code:number) => {
        if(code.toString().length == 4)
        {
            setLoading(true)
            await getUserDatas()
            .then(async (user) => {
                if(user.length > 0)
                {
                    const res = await db.select().from(temp).where(and(eq(temp.compte, user[0].num_compte), eq(temp.code_verification, code))).orderBy(desc(temp.date_expiration)).limit(1)
                    //console.log(res, user[0].num_compte)
                    if(res.length > 0)
                    {
                        if(res[0].date_expiration < new Date())
                        {
                            setLoading(false)
                            alert('Le code de vérification à expiré veuillez demander un autre code.')
                        }
                        else
                        {
                            setLoading(false)
                            const data = [
                                {num_compte: user[0].num_compte, nomcomplet: user[0].nomcomplet, numero: user[0].numero }
                            ]

                            await storeUserDatas(data)
                            navigation.navigate('LockScreen')
                        }
                    }
                    else
                    {
                        setLoading(false)
                        alert('Le code de vérification est incorrect, veuillez réessayer.')
                    }
                }
            })
            .catch((error) => {
                setLoading(false)
                alert(error)
            })
        }
    }

    function chargement(){
        return (
            <Modal visible={loading} transparent animationType="slide">
                <View className="flex-1 bg-black/10 items-center justify-center">
                    <ActivityIndicator size='large' color='black' />
                </View>
            </Modal>
        )
    }
    
    return (
        
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} className='flex-1 px-5 py-10'>
            <StatusBar style='dark' backgroundColor='white' />
            <View className='mt-6'>
                <Image source={require('../assets/images/otp.png')} className='w-60 h-60' />
            </View>

            <View className='mt-6'>
                <Text style={{fontFamily: 'Bold'}} className='text-6xl p-2 text-center'>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
                <Text style={{fontFamily: 'Regular'}} className='text-sm p-2 text-center'>Nous avons envoyé le code de verification sur votre  numero.</Text>

                <TouchableOpacity disabled={!stopTimer} style={{opacity: stopTimer ? 1 : 0.1}}>
                    <Text style={{fontFamily: 'Regular'}} className='text-lg text-center rounded-md text-blue-500'>Renvoyer le code</Text>
                </TouchableOpacity>
            </View>

            <View className='mt-7 p-2'>
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 100 : 0} className='flex-row gap-4 mb-10'>

                    <OtpInput 
                        numberOfDigits={4} 
                        autoFocus={false}
                        onTextChange={(text:any) => handleCode(text)} 
                        focusStickBlinkingDuration={400}
                        theme={{
                            pinCodeContainerStyle: {
                                width: 58,
                                height: 58,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 12,
                                margin: 5
                            }
                        }}
                    />
                    {/* <TextInput
                        className='bg-gray-200 w-16 h-16 rounded-lg text-center text-lg p-2'
                        keyboardType='numeric'
                        maxLength={1}
                        style={{fontFamily: 'Bold'}}
                    />

                    <TextInput
                        className='bg-gray-200 w-16 h-16 rounded-lg text-center text-lg p-2'
                        keyboardType='numeric'
                        maxLength={1}
                        style={{fontFamily: 'Bold'}}
                    />

                    <TextInput
                        className='bg-gray-200 w-16 h-16 rounded-lg text-center text-lg p-2'
                        keyboardType='numeric'
                        maxLength={1}
                        style={{fontFamily: 'Bold'}}
                    />

                    <TextInput
                        className='bg-gray-200 w-16 h-16 rounded-lg text-center text-lg p-2'
                        keyboardType='numeric'
                        maxLength={1}
                        style={{fontFamily: 'Bold'}}
                    /> */}
                </KeyboardAvoidingView>

                <TouchableOpacity className='flex-row gap-2 items-center justify-center'>
                    <Text className='text-center font-bold'>+225 00 00 00 00 00</Text>
                    <Feather name="edit" size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>
            {/* <View className='w-full p-6'>
                <View className='flex-row justify-between w-full mb-4'>
                    {[1,2,3].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-lg w-16 h-16 items-center justify-center p-2'>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between w-full mb-4'>
                    {[4,5,6].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-lg w-16 h-16 items-center justify-center p-2'>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between w-full mb-4'>
                    {[7,8,9].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-lg w-16 h-16 items-center justify-center p-2'>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between w-full mb-4'>
                    {["",'0','img'].map((number) => (
                        <TouchableOpacity key={number} style={{backgroundColor: number == '' ? 'transparent' : '#e2e8f0'}} className='bg-slate-200 rounded-lg w-16 h-16 items-center justify-center p-2'>
                            {number === 'img'? <AntDesign name="closesquareo" size={24} color="black" /> : <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            </View> */}
            {chargement()}
        </ScrollView>
    )
}

export default Code