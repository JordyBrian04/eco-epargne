import { View, Text, BackHandler, ScrollView, Image, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import { getResultatTransaction, getTransaction } from '../services/OnlineRequest';
import useCustomFonts from '../constants/FONTS';
import { formatFrenchDate, transformDateToSpecificDateTime } from '../components/utils';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


const ResultatTransaction = ({navigation, route}:any) => {

    const id = route.params?.id
    // const num_epargne = route.params.num_epargne;
    const [transactionArray, setTransactionArray] = useState<any>([])
    const fontsLoaded = useCustomFonts();
    const widthScreen = Dimensions.get('window').width


    const printRecu = async () => {

        // Chemin vers l'image locale
        const imageAsset = Asset.fromModule(require('../assets/images/logo.png'));
        await imageAsset.downloadAsync();

        console.log(imageAsset)

        const imageUri = imageAsset.localUri || imageAsset.uri;

        // Conversion de l'image en base64
        // const fileInfo = await FileSystem.getInfoAsync(imageAsset);
        // console.log(fileInfo)

        // // Convertir l'image locale en base64
        // const base64Image = `data:image/png;base64,${await FileSystem.readAsStringAsync(
        //     (await fileInfo).uri,
        //     { encoding: FileSystem.EncodingType.Base64 }
        // )}`;

        // console.log(base64Image)

        const html = `
            <html>
                <body>
                    <img src="${imageUri}" width: 300px height: 00px />
                </body>
            </html>
        `;

        const file = await Print.printToFileAsync({
            html: html,
            base64: false
        })

        await shareAsync(file.uri)
    }

    const getTransactions = async () => {
        // console.log(num_epargne)
        const res = await getResultatTransaction(id)
        console.log(res)
        setTransactionArray(res?.filter(trans => trans.id === id))
    }

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
        getTransactions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }
    
    return (
        <View className='bg-white flex-1 pt-14 pr-3 pl-3' style={{width:widthScreen}}>
            <ScrollView >
                <View className='justify-center items-center mb-5'>
                    {transactionArray[0]?.sta == 1 ? <Image source={require('../assets/images/customs-clearance.gif')} className='w-[200px] h-[200px]' /> : <Image source={require('../assets/images/error.gif')} className='w-[200px] h-[200px]' />}
                    
                    <View className='mt-3'>
                        <Text className='font-bold text-2xl' style={{fontFamily: 'Bold'}}>Transaction {transactionArray[0]?.sta == 1 ? `effectuée` : 'échouée'}</Text>
                    </View>
                </View>

                <View className='mt-3 items-start justify-start border border-gray-200 p-3 rounded-lg'>
                    <Text className='font-bold text-base text-left' style={{fontFamily: 'SemiBold'}}>Détail de la transaction</Text>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Transaction ID</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.id}</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Date</Text>
                        {/* transactionArray[0]?.updatedAt */}
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray && transactionArray[0]?.updatedAt && formatFrenchDate(transactionArray[0]?.updatedAt)}</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Type de transaction</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.type_transaction}</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Montant</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.montant.toLocaleString('fr-FR')} CFA</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Frais</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{parseInt(transactionArray[0]?.frais)} CFA</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Numéro de transaction</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.numero}</Text>
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Status</Text>
                        {transactionArray[0]?.sta === 1 ? 
                            <View className='p-1 bg-green-600/20 rounded-full'>
                                <Text style={{fontFamily: 'SemiBold'}} className='text-green-600'>Succès</Text>
                            </View> : 
                            <View className='p-1 bg-red-600/20 rounded-full'>
                                <Text style={{fontFamily: 'SemiBold'}} className='text-red-600'>Echoué</Text>
                            </View>}
                        
                        {/* <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.numero}</Text> */}
                    </View>

                    <View className='mt-3 flex-row items-center justify-between w-full'>
                        <Text>Total débité</Text>
                        <Text className='text-right text-base' style={{fontFamily: 'SemiBold'}}>{transactionArray[0]?.montant_debite} CFA</Text>
                    </View>
                </View>

                <TouchableOpacity className='mt-8 p-4 items-center bg-[#5deb40] rounded-xl' onPress={() => printRecu()}>
                    <Text className='text-white' style={{fontFamily: 'SemiBold'}}>Télécharger le reçu</Text>
                </TouchableOpacity>

                <TouchableOpacity className='mt-2 mb-4 p-4 items-center bg-[#0b25d7] rounded-xl' onPress={() => navigation.navigate('Tabs')}>
                    <Text className='text-white' style={{fontFamily: 'SemiBold'}}>Retour à l'accueil</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default ResultatTransaction