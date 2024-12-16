import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import useCustomFonts from '../constants/FONTS';
import { insertTransaction } from '../services/OnlineRequest';
import { Param } from 'drizzle-orm';

const Transaction = ({navigation, route}:any) => {
    const reseau = route.params.reseau
    const action = route.params.action
    // const num_epargne = route.params.num_epargne
    const [showCode, setShowCode] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const fontsLoaded = useCustomFonts();
    const [loading, setLoading] = useState(false)
    const [transaction, setTransaction] = useState({
        numero: '',
        montantSaisie: '0',
        montant: '0',
        frais: 0,
        type_transaction: action,
        mode_transaction: reseau
    })

    // console.log(route)

    const handleValider = async () => {
        try {
            if(transaction.numero != '' && transaction.montant != '0')
            {
                const regex = /^(07|05|01)[0-9]{8}$/
                if(regex.test(transaction.numero))
                {
                    if(parseInt(transaction.montant) >= 1000)
                    {
                        setShowModal(true)
                        const res:any = await insertTransaction(transaction)
                        if(res[0]?.id)
                        {
                            setShowModal(false)
                            navigation.navigate({name: 'ResultatTransaction', params: {id: res[0]?.id}})
                            // console.log(res)
                        }
                        else
                        {
                            setShowModal(false)
                            navigation.navigate({name: 'ResultatTransaction'})
                        }
                    }
                    else
                    {
                        alert("Veuillez entrer un montant supérieur à 1000 FCFA")
                    }
                }
                else
                {
                    alert("Veuillez saisir un numéro de téléphone valide")
                }
            }
            else
            {
                alert("Veuillez remplir tous les champs")
            }
        } catch (error) {
            alert("Une erreur s'est produite")
            console.log(error)
        }

    }

    const calculeMontant = (montantValue:number) => {

        if(isNaN((montantValue)))
        {
            setTransaction({...transaction, montant: '0'})
        }
        else
        {
            const mont:any = montantValue - (montantValue*0.01)
            const frais:any = montantValue*0.01 
            // console.log(mont)
            setTransaction({...transaction, montant:  `${mont}`, montantSaisie : `${montantValue}`, frais: parseInt(frais)})
        }
    }

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (
    <View className='bg-[#F9F7F7] flex-1 pt-8 pr-3 pl-3'>
      <ScrollView className='mt-6'>
            <TouchableOpacity
                className="flex-row items-center"
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="left" size={24} color="orange" />
                <Text className="ml-1 text-[#FFB31B]">Retour</Text>
            </TouchableOpacity>

            <View className='flex-1 items-center justify-center mt-10 h-full'>
                <Text className='text-lg mb-4' style={{fontFamily: 'Medium'}}>{action} {reseau}</Text>

                {reseau === "ORANGE" ? 
                
                    <Image source={require("../assets/images/orange.png")} className='w-11 h-[42px] rounded-full'/> :

                    reseau === "WAVE" ? 

                    <Image source={require("../assets/images/wave.png")} className='w-11 h-[42px] rounded-full'/> :

                    reseau === "MTN" ?

                    <Image source={require("../assets/images/mtn.jpg")} className='w-11 h-[42px] rounded-full'/> :

                    <Image source={require("../assets/images/moov.png")} className='w-11 h-[42px] rounded-full'/>
                }

                <KeyboardAvoidingView className='bg-white p-3 mt-10 w-[90%] rounded-2xl'>

                        <View className='mb-4'>
                            <Text className='text-[#838383] text-sm ml-4' style={{fontFamily : 'Regular'}}>Numéro à débiter</Text>
                            <TextInput
                                placeholder={'+225 00 00 00 00 00'}
                                placeholderTextColor={'#838383'}
                                className='bg-[#FAFAFA] p-4 rounded-2xl mt-3'
                                keyboardType='phone-pad'
                                value={transaction.numero}
                                onChangeText={(text) => setTransaction({...transaction, numero: text})}
                            />
                        </View> 

                        <View>
                            <Text className='text-[#838383] text-sm ml-4' style={{fontFamily : 'Regular'}}>Montant</Text>
                            <TextInput
                                placeholder={'2 000'}
                                placeholderTextColor={'#838383'}
                                className='bg-[#FAFAFA] p-4 rounded-2xl mt-3'
                                keyboardType='numeric'
                                value={transaction.montantSaisie}
                                onChangeText={(text) => calculeMontant(parseInt(text))}
                            />
                            <Text className='text-xs text-right mt-1'>1% - Frais Opérateur</Text>
                        </View> 

                        <View>
                            <Text className='text-[#838383] text-sm ml-4' style={{fontFamily : 'Regular'}}>Montant à recevoir</Text>
                            <TextInput
                                placeholder={'2 000'}
                                placeholderTextColor={'#838383'}
                                className='bg-[#FAFAFA] p-4 rounded-2xl mt-3'
                                keyboardType='numeric'
                                value={transaction.montant}
                                readOnly
                                onChangeText={(text:any) => setTransaction({...transaction, montant: text})}
                            />
                        </View> 

                    <TouchableOpacity className='p-6 rounded-2xl items-center justify-center bg-[#0b25d7] mt-4 mb-4' onPress={ () => handleValider()} disabled={loading}>
                        <Text className='text-white text-xs' style={{fontFamily: 'SemiBold'}}>
                            Valider {loading && <ActivityIndicator size='small' color='white' className='ml-2' />}
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
      </ScrollView>
      {/* {renderModal()} */}
    </View>
    )
}

export default Transaction