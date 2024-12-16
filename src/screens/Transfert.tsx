import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import useCustomFonts from '../constants/FONTS';
import { insertTransaction, insertTransfert } from '../services/OnlineRequest';
import { Param } from 'drizzle-orm';
import { getUserDatas } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';

const Transfert = ({navigation, route}:any) => {
    const num_compte = route.params.num_epargne
    const action = route.params.action
    // const num_epargne = route.params.num_epargne
    const [showCode, setShowCode] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const fontsLoaded = useCustomFonts();
    const [currentUser, setUser] = useState<any>([]);
    const [solde, setSolde] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transaction, setTransaction] = useState({
        numero: '',
        montantSaisie: '',
        montant: '0',
        frais: 0,
        type_transaction: action,
        mode_transaction: 'Compte principal',
        num_epargne: num_compte
    })

    const fetchUserData = async () => {
        const userData = await getUserDatas();
        // console.log(userData)
        // setUser(userData);
        setSolde(userData?.solde || 0);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    )

    const handleValider = async () => {
        try {
            if(transaction.montantSaisie != '')
            {
                console.log(parseInt(transaction.montantSaisie), solde)
                    if(parseInt(transaction.montantSaisie) < solde && parseInt(transaction.montantSaisie) >= 100)
                    {
                        setShowModal(true)
                        const res:any = await insertTransfert(transaction)
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
                        alert("Le montant saisie doit être supérieur à 100 CFA et inférieur au montant disponible")
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
                <Text className='text-lg mb-4 text-center' style={{fontFamily: 'Bold'}}>{action} sur le compte {num_compte}</Text>

                <View className='border border-gray-100 bg-[#7F95E0]/30 p-3 rounded-full items-center justify-center'>
                    <Image source={require("../assets/images/transference.png")} className='w-11 h-[42px] rounded-full'/>
                </View>

                <KeyboardAvoidingView className='bg-white p-3 mt-10 w-[90%] rounded-2xl'>

                        <View>
                            <Text className='text-[#838383] text-sm ml-4' style={{fontFamily : 'Regular'}}>Montant</Text>
                            <TextInput
                                placeholder={'2 000'}
                                placeholderTextColor={'#838383'}
                                className='bg-[#FAFAFA] p-4 rounded-2xl mt-3'
                                keyboardType='numeric'
                                value={transaction.montantSaisie}
                                onChangeText={(text) => setTransaction({...transaction, montantSaisie: text, montant: text})}
                            />
                        </View> 

                        <View className='mt-2'>
                            <Text className='text-[#838383] text-sm ml-4' style={{fontFamily : 'Regular'}}>Montant disponible</Text>
                            <TextInput
                                placeholder={'2 000'}
                                placeholderTextColor={'#838383'}
                                className='bg-[#FAFAFA] p-4 rounded-2xl mt-3 text-[#0b25d7]'
                                keyboardType='numeric'
                                style={{fontFamily : 'Bold'}}
                                value={`${solde.toLocaleString('fr-FR')} CFA`}
                                readOnly
                                onChangeText={(text:any) => setSolde(text)}
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

export default Transfert