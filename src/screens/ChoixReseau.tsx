import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import useCustomFonts from '../constants/FONTS';
import {AntDesign} from '@expo/vector-icons';

const ChoixReseau = ({navigation, route}:any) => {

    const fontsLoaded = useCustomFonts();
    const action = route.params.action

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-200'>
            <ScrollView className='pr-3 pl-3 pt-5'>
                <Text style={{fontFamily : "Bold"}} className='text-xl'>Faire un {action} via</Text>

                <View className='mt-5'>

                    {/* Orange Money */}
                    <TouchableOpacity className='rounded-xl p-5 items-center bg-white flex-row justify-between mb-3' onPress={() => navigation.navigate({name: 'Transactions', params: {action: action, reseau: "ORANGE"}})}>
                        <Image source={require('../assets/images/orange.png')} className='w-12 h-12 bg-cover rounded-full' />
                        <View className='w-[70%]'>
                            <Text style={{fontFamily : "Bold"}} className='text-base'>Orange Money</Text>
                            <Text className='text-xs'>1% - Frais Opérateur</Text>
                        </View>
                        <View className='p-1 items-center justify-center bg-blue-600/20 rounded-full'>
                            <AntDesign name="right" size={17} color="#0b25d7" />
                        </View>
                    </TouchableOpacity>

                    {/* MTN */}
                    <TouchableOpacity className='rounded-xl p-5 items-center bg-white flex-row justify-between mb-3' onPress={() => navigation.navigate({name: 'Transactions', params: {action: action, reseau: "MTN"}})}>
                        <Image source={require('../assets/images/mtn.jpg')} className='w-12 h-12 bg-cover rounded-full' />
                        <View className='w-[70%]'>
                            <Text style={{fontFamily : "Bold"}} className='text-base'>MTN MoMo</Text>
                            <Text className='text-xs'>1% - Frais Opérateur</Text>
                        </View>
                        <View className='p-1 items-center justify-center bg-blue-600/20 rounded-full'>
                            <AntDesign name="right" size={17} color="#0b25d7" />
                        </View>
                    </TouchableOpacity>

                    {/* MOOV */}
                    <TouchableOpacity className='rounded-xl p-5 items-center bg-white flex-row justify-between mb-3' onPress={() => navigation.navigate({name: 'Transactions', params: {action: action, reseau: "MOOV"}})}>
                        <Image source={require('../assets/images/moov.png')} className='w-12 h-12 bg-cover rounded-full' />
                        <View className='w-[70%]'>
                            <Text style={{fontFamily : "Bold"}} className='text-base'>Moov Money</Text>
                            <Text className='text-xs'>1% - Frais Opérateur</Text>
                        </View>
                        <View className='p-1 items-center justify-center bg-blue-600/20 rounded-full'>
                            <AntDesign name="right" size={17} color="#0b25d7" />
                        </View>
                    </TouchableOpacity>

                    {/* WAVE */}
                    <TouchableOpacity className='rounded-xl p-5 items-center bg-white flex-row justify-between mb-3' onPress={() => navigation.navigate({name: 'Transactions', params: {action: action, reseau: "WAVE"}})}>
                        <Image source={require('../assets/images/wave.png')} className='w-12 h-12 bg-cover rounded-full' />
                        <View className='w-[70%]'>
                            <Text style={{fontFamily : "Bold"}} className='text-base'>Wave</Text>
                            <Text className='text-xs'>1% - Frais Opérateur</Text>
                        </View>
                        <View className='p-1 items-center justify-center bg-blue-600/20 rounded-full'>
                            <AntDesign name="right" size={17} color="#0b25d7" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChoixReseau