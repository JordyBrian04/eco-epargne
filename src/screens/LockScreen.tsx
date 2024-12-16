import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Haptics from 'expo-haptics'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import * as LocalAuthentication from 'expo-local-authentication'
import { get_user_local, user_insert } from '../services/Requests';
import { getUserDatas, storeUserDatas } from '../services/AsyncStorage';
import { updateMdp } from '../services/OnlineRequest';
import { useFocusEffect } from '@react-navigation/native';

const LockScreen = ({navigation}:any) => {
    const [code, setCode] = useState<number[]>([])
    const codeLength = Array(4).fill(0)
    const [action, setAction] = useState('')
    const [loading, setLoading] = useState(false)
    const [pwd, setPwd] = useState('')

    const offset = useSharedValue(0)
    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        }
    })

    const valideMdp = async () => {
        //console.log(await get_user_local())
        storeUserDatas(await get_user_local())
        setCode([])
        navigation.navigate('Tabs')
    }

    const OFFSET = 20;
    const TIME = 80;

    useFocusEffect(
        React.useCallback(() => {
            const getUser = async () => {
                const userdata: any = await get_user_local();
                console.log('Données utilisateur chargées:', userdata);
    
                if (userdata != null) {
                    setPwd(userdata.mdp);
                    setAction('edit');
                } else {
                    setAction('create');
                }
            };
    
            getUser();
        }, [])
    );

    // useEffect(() => {
    //     const getUser = async () => {
    //         const userdata: any = await get_user_local();
    //         if (userdata != null) {
    //             setPwd(userdata.mdp);
    //             setAction('edit');
    //         } else {
    //             setAction('create');
    //         }
    //     };
    
    //     getUser();
    // }, []);

    useEffect(() => {
        const backAction = () => {

          return true; // Bloque le retour en arrière
        };
    
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
    
        // Nettoyage : supprimer l'événement lorsque le composant est démonté
        return () => backHandler.remove();
    }, []);



    useEffect(() => {
        if(code.length === 4 && action === 'edit')
        {
            if(code.join('') === pwd)
            {
                valideMdp()
            }
            else
            {
                //alert('Le code de vérification est incorrect. Veuillez réessayer.')
                offset.value = withSequence(
                    withTiming(-OFFSET, {duration: TIME/2}),
                    withRepeat(withTiming(OFFSET, {duration: TIME}), 4, true),
                    withTiming(0, {duration: TIME/2}),
                )
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                setCode([])
            }
        }

    }, [code, action])

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setCode([...code, number])
        //console.log(code)
    }

    const numberBackspace = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setCode(code.slice(0, -1))
    }

    const onBiometricPress = async () => {
        const {success} = await LocalAuthentication.authenticateAsync()
        if (success)
        {
            navigation.navigate('Tabs')
        }
        else
        {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
    }

    const handleSubmit = async () => {
        const res = await getUserDatas()
        if(res){
            console.log(res)
            if(code.length === 4){
                const data = {
                    num_compte: res[0].num_compte,
                    mdp: code.join('')
                }
                
                const result = await updateMdp(data)
                if(result?.rowCount)
                {
                    const data = {
                        num_compte: res[0].num_compte,
                        nomcomplet: res[0].nomcomplet,
                        numero: res[0].numero,
                        mdp: code.join(''),
                        sta: 1
                    }

                    const insert:any = await user_insert(data)
                    console.log(insert)
                    if(insert?.row)
                    {
                        alert('Vous ne pouvez pas ajouter plus de 3 comptes')
                    }
                    else if (insert == true)
                    {
                        storeUserDatas(await get_user_local())
                        navigation.navigate('Tabs')
                    }
                    else if (insert == 'User already exists')
                    {
                        alert('Ce compte existe déjà veuillez entrez le bon mot de passe')
                        setCode([])
                    }
                    else
                    {
                        alert('Erreur lors de l\'ajout du compte');
                    }
                    // if(insert)
                    // {
                    //     navigation.navigate('Tabs')
                    // }
                    // else
                    // {
                    //     alert('Erreur lors de la création du mot de passe.')
                    // }
                }
                else
                {
                    alert('Erreur serveur lors de la création du mot de passe.')
                }
            }
        }
    }

    return (
        <ScrollView className='flex-1 px-10 py-10 bg-white'>
            <View className='justify-center items-center'>
                <Image source={require('../assets/images/logo.png')} className='w-56 h-56' />
            </View>

            <Animated.View className='flex-row justify-center items-center gap-5 mb-14' style={[{marginVertical: 100}, style]}>
                {codeLength.map((_, index) =>  (
                    <View key={index} className='w-5 h-5 rounded-full' style={{backgroundColor: code[index] ? '#1e40af' : code[index] == 0 ? '#1e40af' : '#D8DCE2'}}></View>
                ))}
            </Animated.View>

            <View style={{gap: 40}}>
                <View className='flex-row justify-between'>
                    {[1,2,3].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-full w-16 h-16 items-center justify-center p-2' onPress={() => onNumberPress(number)}>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between'>
                    {[4,5,6].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-full w-16 h-16 items-center justify-center p-2' onPress={() => onNumberPress(number)}>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between'>
                    {[7,8,9].map((number) => (
                        <TouchableOpacity key={number} className='bg-slate-200 rounded-full w-16 h-16 items-center justify-center p-2' onPress={() => onNumberPress(number)}>
                            <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='flex-row justify-between items-center'>
                    <TouchableOpacity onPress={onBiometricPress}>
                        <MaterialCommunityIcons name="face-recognition" size={26} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity className='bg-slate-200 rounded-full w-16 h-16 items-center justify-center p-2' onPress={() => onNumberPress(0)}>
                        <Text style={{fontFamily: 'Bold'}} className='text-lg text-center'>0</Text>
                    </TouchableOpacity>

                    <View style={{minWidth: 30}}>
                        {code.length > 0 && (
                            <TouchableOpacity onPress={numberBackspace}>
                                <MaterialIcons name="backspace" size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {action === 'edit' ?             
                <TouchableOpacity className='mt-6 text-center'>
                    <Text className='text-center text-blue-500'>Mot de passe oublié</Text>
                </TouchableOpacity>
                :             
                // <TouchableOpacity className='p-4 bg-blue-800 rounded-full absolute -bottom-20 w-full' onPress={handleSubmit} disabled={loading}>
                //         <Text style={{fontFamily: "Bold", fontSize: 18 }} className='text-center text-white'>
                //             Valider {loading && <ActivityIndicator size='small' color='white' className='ml-2' />}
                //         </Text>
                // </TouchableOpacity> 
                <TouchableOpacity className='flex-grow bg-blue-600 p-4 rounded-2xl items-center mt-2' disabled={loading} onPress={handleSubmit}>
                    <Text className='text-white' style={{fontFamily: "Bold" }}>
                        Valider {loading && <ActivityIndicator size='small' color='white' className='ml-2' />}
                    </Text>
                </TouchableOpacity>
            }



        </ScrollView>
    )
}

export default LockScreen