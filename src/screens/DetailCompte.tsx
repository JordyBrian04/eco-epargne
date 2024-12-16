import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {AntDesign, EvilIcons} from '@expo/vector-icons';
import useCustomFonts from '../constants/FONTS';
import { getEpargne, getTransaction } from '../services/OnlineRequest';
import { transformDateToSpecificDateTime } from '../components/utils';

const DetailCompte = ({navigation, route}:any) => {
    const fontsLoaded = useCustomFonts();
    const num_epargne = route.params.num_epargne;
    const [transactionArray, setTransactionArray] = useState<any>([])
    const [epargne, setEpargne] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [reseau, setReseau] = useState('ORANGE')
    const [action, setAction] = useState('')
    const [refresh, setRefreshing] = useState(false);
    const [retrait, setRetrait] = useState(true);

    const getEpargneList = async () => {
        const res = await getEpargne()

        const date:any = res?.filter(epargne => epargne.num_epargne === num_epargne).map(a => a.date_fin)
        const date_fin:any = new Date(date[0])

        if(date_fin <= new Date())
        {
            setRetrait(false)
        }
        // console.log(date)
        setEpargne(res?.filter(epargne => epargne.num_epargne === num_epargne))
    }

    const getTransactions = async () => {
        const res = await getTransaction(num_epargne)
        // console.log(res)
        setTransactionArray(res)
    }
    
    useEffect(() => {
        getEpargneList()
        getTransactions()
    }, [])

    const refreshing = () => {
        setRefreshing(true);
    
        getEpargneList()
        getTransactions()
    
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      };

    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split("-"); // Découper la chaîne en année, mois et jour
        return `${day}/${month}/${year}`; // Recomposer la date dans le format désiré
    };

    const handleSubmit = () => {
        setShowModal(!showModal)
        // navigation.navigate({name: 'DetailCompte', params:{num_epargne: ep.num_epargne}})
        navigation.navigate({ name: 'Transactions', params: {reseau: reseau, action:action, num_epargne: num_epargne} })
    }

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    function renderModal () {
        return(
            <Modal visible={showModal} transparent animationType='fade'>
                <View className='flex-1 bg-black/20 items-center justify-center'>
                    <View className='p-3 bg-white rounded-2xl w-[90%]'>
                        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                            <EvilIcons name="close" size={24} color="black" />
                        </TouchableOpacity>

                        <Text className='text-center text-[16px]' style={{fontFamily: 'Regular'}}>{action}</Text>

                        {/* Mobile Money */}
                        <View className='bg-slate-100 p-4 rounded-2xl mt-3 mb-3'>
                            <TouchableOpacity className='flex-row items-center' onPress={() => [setReseau('orange')]}>
                                <View className='w-4 h-4 border border-[#0b25d7] items-center justify-center' style={{borderRadius: 100}}>
                                    <View className='w-2 h-2' style={{backgroundColor: '#0b25d7', borderRadius: 100}}></View>
                                </View>
                                <Text className='text-sm ml-2'>Mobile money</Text>
                            </TouchableOpacity>

                            <View className='p-4 mt-2 flex'>
                                <View className='flex-row justify-between items-center'>

                                    {/* Orange */}
                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center' onPress={() => setReseau('ORANGE')} style={{borderRadius: 100, borderColor: reseau == 'ORANGE' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/images/orange.png")} className='w-11 h-[42px] rounded-full'/>
                                    </TouchableOpacity>

                                    {/* Wave */}
                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center' onPress={() => setReseau('WAVE')} style={{borderRadius: 100, borderColor: reseau == 'WAVE' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/images/wave.png")} className='w-11 h-[43px] rounded-full'/>
                                    </TouchableOpacity>

                                    {/* MTN */}
                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center' onPress={() => setReseau('MTN')} style={{borderRadius: 100, borderColor: reseau == 'MTN' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/images/mtn.jpg")} className='w-11 h-[43px] rounded-full'/>
                                    </TouchableOpacity>

                                    {/* MOOV */}
                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center' onPress={() => setReseau('MOOV')} style={{borderRadius: 100, borderColor: reseau == 'MOOV' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/images/moov.png")} className='w-11 h-[43px] rounded-full'/>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>

                        {/* Carte bancaire */}
                        {/* <View className='bg-slate-100 p-4 rounded-2xl mt-3 mb-3'>
                            <TouchableOpacity className='flex-row items-center' onPress={() => [setTypeTransaction('Carte bancaire'), setReseau('visa')]}>
                                <View className='w-4 h-4 border border-[#0b25d7] items-center justify-center' style={{borderRadius: 100}}>
                                    <View className='w-2 h-2' style={{backgroundColor: typeTransaction == 'Carte bancaire' ? '#0b25d7' : 'rgba(241 245 249 / 1)', borderRadius: 100}}></View>
                                </View>
                                <Text className='text-sm ml-2'>Carte bancaire</Text>
                            </TouchableOpacity>

                            <View className='p-4 mt-2' style={{display : typeTransaction == 'Carte bancaire' ? 'flex' : 'none'}}>
                                <View className='flex-row items-center'>

                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center' onPress={() => setReseau('visa')} style={{borderRadius: 100, borderColor: reseau == 'visa' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/visa.png")} className='w-11 h-[42px]'/>
                                    </TouchableOpacity>

                                    <TouchableOpacity className='w-14 h-14 p-2 border-2 items-center justify-center ml-6' onPress={() => setReseau('djamo')} style={{borderRadius: 100, borderColor: reseau == 'djamo' ? '#0b25d7' : 'rgba(241 245 249 / 1)'}}>
                                        <Image source={require("../assets/djamo.png")} className='w-11 h-[43px]'/>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View> */}

                        <View className='mt-6'>
                            <TouchableOpacity 
                                className='p-6 rounded-2xl items-center justify-center bg-[#0b25d7]'
                                onPress={handleSubmit}
                            >
                                <Text className='text-white text-xs' style={{fontFamily: 'SemiBold'}}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
      }

    return (
        <SafeAreaView className='flex-1 bg-slate-100'>
            <ScrollView          refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshing} />
        }>
                <StatusBar style='dark' backgroundColor='white' />

                <TouchableOpacity className='mb-5' onPress={() => navigation.navigate('Tabs')}>
                    <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>

                <View className='bg-white p-4 rounded-2xl'>
                    <Text style={{fontFamily: "Bold"}} className='text-xl text-center text-wrap'>{epargne && epargne.length > 0 && epargne[0]?.libelle}</Text>

                    <View className='mt-8'>
                        <Text style={{fontFamily: "SemiBold"}} className='text-4xl text-center text-wrap'>
                        {epargne && epargne.length > 0 && epargne[0]?.solde.toLocaleString('fr-FR')}
                            <Text className='text-sm text-gray-400'>CFA</Text>
                        </Text>

                        <Text style={{fontFamily: "SemiBold"}} className='text-sm text-center text-red-500'>Prochain retrait : {epargne && epargne.length > 0 && formatDate(epargne[0]?.date_fin)}</Text>
                    </View>

                    <View className='mt-8 flex-row justify-between w-full'>
                        <TouchableOpacity className='bg-[#0b25d7] p-3 rounded-3xl items-center w-[48%]' onPress={() => navigation.navigate({name: 'Transfert', params: {num_epargne: num_epargne, action: "Depot"}})}>
                            <Text style={{fontFamily: "SemiBold"}} className='text-lg text-white'>Déposer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='bg-red-500 p-3 rounded-3xl items-center w-[48%]' disabled={retrait} style={{opacity: retrait ? 0.4 : 1}} onPress={() => [setAction('Retrait'), setShowModal(!showModal)]}>
                            <Text style={{fontFamily: "SemiBold"}} className='text-lg text-white'>Retirer</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='p-4 bg-white mt-5 rounded-xl'>
                    <Text style={{fontFamily: "Bold"}} className='text-lg'>Historique</Text>

                    <View className='mt-5'>
                        {/* navigation.navigate({name: 'ResultatTransaction', params: {id: transaction.id}}) */}
                        {transactionArray && transactionArray.length > 0 && transactionArray.map((transaction:any) => (
                            <TouchableOpacity key={transaction.id} onPress={() => navigation.navigate({name: 'ResultatTransaction', params: {id: transaction.id}})}>
                                <View className='flex-row justify-between items-center mb-5'>
                                    <View className='p-2 rounded-full justify-center  items-center'>
                                        <Image source={
                                            transaction.mode_transaction === 'WAVE' ?
                                            require('../assets/images/wave.png') :
                                            transaction.mode_transaction === 'ORANGE' ?
                                            require('../assets/images/orange.png') :
                                            transaction.mode_transaction === 'MTN' ?
                                            require('../assets/images/mtn.jpg') :
                                            transaction.mode_transaction === 'MOOV' ?
                                            require('../assets/images/moov.png') : 
                                            require('../assets/images/transference.png')
                                        } className='w-12 h-12 bg-cover rounded-full' />
                                    </View>

                                    <View className='flex-col gap-[6px]'>
                                        <View className='flex-row justify-between items-center w-[253]'>
                                            <Text style={{fontFamily: "SemiBold"}} className='text-base'>
                                                {transaction.type_transaction}
                                            </Text>
                                            <Text style={{fontFamily: "Regular", color: transaction.type_transaction == 'Depot' ? '#48e80d':'#e8380d'}}>{transaction.montant.toLocaleString('fr-FR')} CFA</Text>
                                        </View>
                                        <Text className='p-1 bg-blue-500/20 w-[165px] rounded-3xl text-xs'>{transaction.num_epargne}</Text>
                                        <Text className='text-xs'>
                                            {transformDateToSpecificDateTime(transaction.updatedAt)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}


                        {/* <View className='flex-row justify-between items-center mb-5'>
                            <View className='border border-gray-100 bg-gray-100 p-2 rounded-full justify-center  items-center'>
                                <Image source={require('../assets/images/cash-out.png')}  />
                            </View>

                            <View>
                                <View className='flex-row justify-between items-center w-[260]'>
                                    <Text style={{fontFamily: "SemiBold"}}>Retrait</Text>
                                    <Text style={{fontFamily: "Regular"}}>- 10 000 CFA</Text>
                                </View>
                                <Text>
                                    1 Novembre à 12:00:00
                                </Text>
                            </View>
                        </View>
                        
                        <View className='flex-row justify-between items-center mb-5'>
                            <View className='border border-gray-100 bg-gray-100 p-2 rounded-full justify-center  items-center'>
                                <Image source={require('../assets/images/cash-in.png')}  />
                            </View>

                            <View>
                                <View className='flex-row justify-between items-center w-[260]'>
                                    <Text style={{fontFamily: "SemiBold"}}>Recharge</Text>
                                    <Text style={{fontFamily: "Regular"}}>100 000 CFA</Text>
                                </View>
                                <Text>
                                    1 Novembre à 12:00:00
                                </Text>
                            </View>
                        </View>

                        <View className='flex-row justify-between items-center mb-5'>
                            <View className='border border-gray-100 bg-gray-100 p-2 rounded-full justify-center  items-center'>
                                <Image source={require('../assets/images/cash-out.png')}  />
                            </View>

                            <View>
                                <View className='flex-row justify-between items-center w-[260]'>
                                    <Text style={{fontFamily: "SemiBold"}}>Retrait</Text>
                                    <Text style={{fontFamily: "Regular"}}>- 10 000 CFA</Text>
                                </View>
                                <Text>
                                    1 Novembre à 12:00:00
                                </Text>
                            </View>
                        </View> */}
                        
                    </View>
                </View>
            </ScrollView>
            {renderModal()}
        </SafeAreaView>
    )
}

export default DetailCompte