import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import useCustomFonts from '../constants/FONTS';
import {AntDesign} from '@expo/vector-icons';
import { getEpargne } from '../services/OnlineRequest';
import { useFocusEffect } from '@react-navigation/native';

const ChoixCompte = ({navigation, route}:any) => {

    const fontsLoaded = useCustomFonts();
    const [epargneArray, setEpargneArray] = useState<any>([])
    const [refresh, setRefreshing] = useState(false);
    // const action = route.params.action

    const getEpargneList = async () => {
        setEpargneArray([])
        const res = await getEpargne()
        // console.log(res)
        setEpargneArray(res)
    }

    useFocusEffect(
        React.useCallback(() => {
            getEpargneList()
        }, [])
    )

    const refreshing = () => {
        setRefreshing(true);
    
        getEpargneList()
    
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-200'>
            <ScrollView className='pr-3 pl-3 pt-5' refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshing} />}>
                <Text style={{fontFamily : "Bold"}} className='text-xl'>Transferer du compte vers</Text>

                <View className='mt-5'>

                    {/* Orange Money */}
                    {epargneArray && epargneArray.length > 0 && epargneArray.map((ep:any) => (
                        <TouchableOpacity key={ep.num_epargne} className='rounded-xl p-5 items-center bg-white flex-row justify-between mb-3' onPress={() => navigation.navigate({name: 'Transfert', params: {num_epargne: ep.num_epargne, action: "Depot"}})}>
                            <Image source={require('../assets/images/money.gif')} className='w-12 h-12 bg-cover rounded-full' />
                            <View className='w-[70%]'>
                                <Text style={{fontFamily : "Bold"}} className='text-base'>{ep.libelle}</Text>
                                <Text className='text-xs'>{ep.type_epargne}</Text>
                            </View>
                            <View className='p-1 items-center justify-center bg-blue-600/20 rounded-full'>
                                <AntDesign name="right" size={17} color="#0b25d7" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChoixCompte