import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform, Dimensions, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import useCustomFonts from '../../constants/FONTS';
import { StatusBar } from 'expo-status-bar';
import {Feather} from '@expo/vector-icons';
import { getUserDatas } from '../../services/AsyncStorage';
import * as Network from 'expo-network';
import { getAllPub, getAllTransaction, getEpargne, getUserOnline } from '../../services/OnlineRequest';
import { update_user } from '../../services/Requests';
import { LinearGradient } from 'expo-linear-gradient';
import { transformDateToSpecificDateTime } from '../../components/utils';
import { addEventListener } from "@react-native-community/netinfo";
import { useFocusEffect } from '@react-navigation/native';


const Home = ({navigation}:any) => {
    const fontsLoaded = useCustomFonts();
    const [showCurrency, setShowCurrency] = useState(true)
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [currentUser, setUser] = useState<any>([]);
    const [solde, setSolde] = useState(0)
    const [ecoSolde, setEcoSolde] = useState(0)
    const [proSolde, setProSolde] = useState(0)
    const [transactions, setTransaction] = useState<any>([]);
    const [refresh, setRefreshing] = useState(false);
    const [pub, setPub] = useState<any>([]);

    const widthScreen = Dimensions.get('window').width
    // const [pub, setPub] = useState<any>([])

    // Récupération des données de publication
    // const pub = [
    //     {id: 1, title: 'Publication 1', description: 'Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1', image: 'https://web.whatsapp.com/28f32023-53fb-4e07-a64a-2782678dcf4d'},
    //     {id: 2, title: 'Publication 2', description: 'Description 2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs88ss_U_OqxHm_jhgfhilDUoiBSXFrWCWf-X-7ha-OurI3WxwiKnqa1HgCr33E_BBQFU&usqp=CAU'},
    //     {id: 3, title: 'Publication 3', description: 'Description 3', image: 'https://play-lh.googleusercontent.com/qxfVKTtIuViVsoTKAgD6s_6fbnhO0mFeev-LNOOmJ5qn-5bkflTqPctpiqCW1i2ubQ'}
    // ]

    // Chargement des données utilisateur au montage
    const fetchUserData = async () => {
        const userData = await getUserDatas();
        setUser(userData);
        setSolde(userData?.solde || 0);
    };

    const getPub = async () => {
        setPub(await getAllPub())
        // console.log(await getAllPub())
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    // Vérification de la connexion à Internet
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        const handleConnectionChange = (state: any) => {
            console.log("Connection", state);
            setIsConnected(state.isConnected);
            console.log("Is connected?", state.isConnected);
        };
        // Subscribe
        // const unsubscribe = addEventListener(state => {
        //     // setIsConnected(state.isConnected);
        //     console.log("Connection", state);
        //     return state

        //     console.log("Is connected?", state.isConnected);
        // });
        const unsubscribe = addEventListener(handleConnectionChange);

        const checkConnection = async () => {
        try {

            const networkState = await Network.getNetworkStateAsync();
            // console.log(isConnected)
            // setIsConnected(networkState.isConnected ?? false);

            if (isConnected && currentUser?.num_compte) {
                const res: any = await getUserOnline();
                // console.log(res);
                if(res)
                {
                    if(parseInt(res[0]?.solde) != parseInt(currentUser?.solde))
                    {
                        //console.log(res[0]?.solde)
                        await update_user(res[0]);
                        setSolde(parseInt(res[0]?.solde));

                        const res_user = await getUserDatas();
                        setUser(res_user)
                        //setSolde(res_user[0].solde === null ? 0 : parseInt(res_user[0].solde))
                    }
                }
            }
        } catch (error) {
            console.error("Failed to get network status:", error);
            setIsConnected(false);
        }
        };

        const startChecking = () => {
            checkConnection(); // Appel initial
            interval = setInterval(checkConnection, 1000); // Vérification périodique
        };

        startChecking();

        return () => clearInterval(interval); // Nettoyage
    }, [currentUser]);

    // const getUser = async () => {
    //     const res = await getUserDatas();
    //     // console.log(res[0])
    //     setUser(res[0])
    //     setSolde(res[0].solde === null ? 0 : res[0].solde)
    // }

    useFocusEffect(
        React.useCallback(() => {
            const getTransactions = async () => {
                setTransaction(await getAllTransaction())
                const res = await getEpargne()
                setEcoSolde(res?.filter(row => row.type_epargne === 'Epargne simple').map((datas:any) => datas.solde).reduce((a, b) => parseInt(a)+parseInt(b), 0))
                setProSolde(res?.filter(row => row.type_epargne === 'Epargne pro').map((datas:any) => datas.solde).reduce((a, b) => parseInt(a)+parseInt(b), 0))
            }
    
            getTransactions()
            getPub()
        }, [])
    )

    const refreshing = () => {
        setRefreshing(true);
    
        fetchUserData();
    
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
      };

    // useEffect(() =>  {
    //     const getTransactions = async () => {
    //         setTransaction(await getAllTransaction())
    //     }

    //     getTransactions()
    // }, []);

    // const checkInternetConnection = async () => {
    //     try {
    //       const networkState = await Network.getNetworkStateAsync();
    //       //console.log(networkState.isConnected)
            
    //       if(networkState.isConnected === true){
              
    //           const res:any = await getUserOnline(currentUser?.num_compte)
    //           //setUser(res[0])
    //           // console.log('online',res[0].solde)
    //           //console.log('local',currentUser.solde)
    //           setIsConnected(true)
    //         if(res[0]?.solde != currentUser?.solde)
    //         {
    //             await update_user(res[0])
    //             await getUser()
    //         }
    //         setSolde(res[0].solde)

    //       }
    //       else
    //       {
    //         setIsConnected(false);
    //       }

    //     } catch (error) {
    //       console.error('Failed to get network status:', error);
    //       setIsConnected(false); // Considérer comme non connecté en cas d'erreur
    //     }
    // };

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }


    return (
            <View className='flex-1'>
                {/* <StatusBar style='dark' backgroundColor='white' /> */}
                <LinearGradient
                    colors={['#0b25d7', '#3d3d3d']}
                    start={{ x: 0, y: 1  }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, paddingTop: 40 }}
                    className='flex-1'
                >
                    <ScrollView contentContainerStyle={{flexGrow: 1}} className='flex-1 h-full'         
                    refreshControl={
                        <RefreshControl refreshing={refresh} onRefresh={refreshing} />
                    }>

                            <View className='items-center flex-row justify-between mb-10 px-5'>
                                <View>
                                    <Text style={{fontFamily: "Light"}} className='text-white'>Bonjour</Text>
                                    <Text style={{fontFamily: "Bold"}} className='text-xl text-white'>{currentUser?.nom_complet}</Text>
                                </View>
                                <Image source={require('../../assets/images/user.png')} className='w-8 h-8' />
                            </View>

                            <View className='px-5 items-center w-full'>
                                <View className='p-3 bg-white shadow-lg w-[99%] -m-4 z-20 rounded-2xl absolute border border-slate-200'>
                                    <View className='items-center'>
                                        <Image source={require('../../assets/images/logo.png')} className='w-16 h-16'  />
                                    </View>
                                    <Text className='text-center' style={{fontFamily: "Light"}}>Solde</Text>
                                    <TouchableOpacity className='mt-3 flex-row justify-center' onPress={() => setShowCurrency(!showCurrency)}>
                                        {showCurrency ? 
                                            <Text style={{fontFamily: "Bold"}} className='text-center text-4xl mr-3'>
                                                {solde.toLocaleString('fr-FR')}
                                                <Text className='text-center text-lg' style={{fontFamily: "Light"}}>CFA</Text>
                                            </Text>
                                            :
                                            <Text style={{fontFamily: "Bold"}} className='text-center text-4xl mr-3'>
                                                *********
                                            </Text>
                                        }

                                        <Feather name="eye" size={24} color="black" />
                                    </TouchableOpacity>

                                    <Text className='text-center text-green-500' style={{fontFamily: "Light"}}>$ 200 000 en crypto</Text>

                                    {/* <View className='mt-3'>
                                        <Text className='text-center text-red-500' style={{fontFamily: "Light"}}>Solde bloqué jusqu'au 31 décembre 2024</Text>
                                    </View> */}

                                    <View className='mt-3 flex-row justify-between items-center p-4 border border-gray-300 rounded-3xl'>
                                        <View className='items-start'>
                                            <Text style={{fontFamily: "Bold"}} className='text-left text-lg mr-3'>
                                                {ecoSolde.toLocaleString('fr-FR')}
                                                <Text className='text-left text-sm' style={{fontFamily: "Light"}}>CFA</Text>
                                            </Text>
                                            <Text className='text-xs'>Simple</Text>
                                        </View>
                                        <View className='w-[2px] bg-gray-200 h-14'></View>
                                        
                                        <View className='items-start'>
                                            <Text style={{fontFamily: "Bold"}} className='text-right text-lg mr-3'>
                                                {proSolde.toLocaleString('fr-FR')}
                                                <Text className='text-left text-sm' style={{fontFamily: "Light"}}>CFA</Text>
                                            </Text>
                                            <Text className='text-xs'>Pro</Text>
                                        </View>
                                        {/*  */}
                                    </View>
                                </View>
                            </View>


                            <View className='p-4 bg-white mt-5 rounded-xl h-full'>
                                <View className='mt-[250px] w-full flex-row items-center justify-between p-4'>
                                    <View className='flex-col items-center'>
                                            <TouchableOpacity className='border border-gray-100 bg-green-500/30 p-3 rounded-full items-center justify-center' onPress={() => navigation.navigate({name: 'ChoixReseau', params: {action: "Depot"}})}>
                                                <Image source={require('../../assets/images/piggy-bank.png')} className='w-8 h-8' />
                                            </TouchableOpacity>
                                            <Text style={{fontFamily: "SemiBold"}}>Déposer</Text>
                                        </View>

                                        <View className='flex-col items-center'>
                                            <TouchableOpacity className='border border-gray-100 bg-red-700/30 p-3 rounded-full items-center justify-center' onPress={() => navigation.navigate({name: 'ChoixReseau', params: {action: "retrait"}})}>
                                                <Image source={require('../../assets/images/top-up.png')} className='w-8 h-8'  />
                                            </TouchableOpacity>
                                            <Text style={{fontFamily: "SemiBold"}}>Retirer</Text>
                                        </View>

                                        <View className='flex-col items-center'>
                                            <TouchableOpacity className='border border-gray-100 bg-[#7F95E0]/30 p-3 rounded-full items-center justify-center' onPress={() => navigation.navigate({name: 'ChoixCompte'})}>
                                                <Image source={require('../../assets/images/transference.png')} className='w-8 h-8'  />
                                            </TouchableOpacity>
                                            <Text style={{fontFamily: "SemiBold"}}>Transfert</Text>
                                        </View>

                                        <View className='flex-col items-center'>
                                            <TouchableOpacity className='border border-gray-100 p-3 bg-[#FFBC00]/30 rounded-full items-center justify-center' onPress={() => navigation.navigate('Crypto')}>
                                                <Image source={require('../../assets/images/bitcoin.png')} className='w-8 h-8' />
                                            </TouchableOpacity>
                                            <Text style={{fontFamily: "SemiBold"}}>Crypto</Text>
                                        </View>
                                </View>

                                {isConnected &&
                                    <View style={{width : widthScreen}} className='mt-3 -ml-4 z-40 bg-gray-100 p-3 h-[150px]'>
                                        <ScrollView className='flex-row gap-1' horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                                            {pub && pub.map((p:any) => {
                                                return (
                                                    <View key={p.id} style={{width : widthScreen - 28}} className='flex-row items-center gap-2 h-full bg-white rounded-2xl p-3'>
                                                        <View>
                                                            <Image source={{uri: p.image}} className='w-14 h-14 bg-cover rounded-lg' />
                                                        </View>
                                                        <View className='w-[70%]'>
                                                            <Text style={{fontFamily: "Bold"}}>{p.titre}</Text>
                                                            <Text style={{fontFamily: "Regular"}} className='text-wrap'>{p.description}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                        </ScrollView>
                                    </View>
                                }


                                {!isConnected &&
                                    <View className='bg-black/50 p-3 mt-3 flex-row items-center rounded-lg'>
                                        <Image source={require('../../assets/images/no-wifi.png')} className='w-14 h-14'  />
                                        <View className='flex-nowrap'>
                                            <Text className='text-white font-bold w-[250px] ml-3'>Aucune connexion internet. Veuillez vous connecter afin d'actualiser votre solde et vos historiques</Text>
                                        </View>
                                    </View>
                                }


                                <Text style={{fontFamily: "Bold"}} className='text-lg mt-10'>Historique</Text>

                                <View className='mt-5'>
                                    {transactions.map((transaction:any) => (
                                        <TouchableOpacity key={transaction.id} onPress={() => navigation.navigate({name: 'ResultatTransaction', params: {id: transaction.id}})}>
                                            <View className='flex-row justify-between items-center mb-5'>
                                                <View className='p-2 rounded-full justify-center  items-center'>
                                                    <Image source={
                                                        transaction.mode_transaction === 'WAVE' ?
                                                        require('../../assets/images/wave.png') :
                                                        transaction.mode_transaction === 'ORANGE' ?
                                                        require('../../assets/images/orange.png') :
                                                        transaction.mode_transaction === 'MTN' ?
                                                        require('../../assets/images/mtn.jpg') :
                                                        transaction.mode_transaction === 'MOOV' ?
                                                        require('../../assets/images/moov.png') : 
                                                        require('../../assets/images/transference.png')
                                                    } className='w-12 h-12 bg-cover rounded-full' />
                                                </View>

                                                <View className='flex-col gap-[6px]'>
                                                    <View className='flex-row justify-between items-center w-[277]'>
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
                                            <Image source={require('../../assets/images/cash-out.png')}  />
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
                                            <Image source={require('../../assets/images/cash-in.png')}  />
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
                                            <Image source={require('../../assets/images/cash-out.png')}  />
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
                </LinearGradient>
            </View>
    )
}

export default Home