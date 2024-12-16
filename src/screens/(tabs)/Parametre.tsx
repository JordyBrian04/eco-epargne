import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Share, Alert, ActivityIndicator, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import useCustomFonts from '../../constants/FONTS';
import { changeAccount, get_user_local, getAllAccounts, logout, user_insert } from '../../services/Requests';
import {Entypo, MaterialIcons} from '@expo/vector-icons';
import { updateNom } from '../../services/OnlineRequest';

const Parametre = ({navigation}:any) => {
    const fontsLoaded = useCustomFonts();
    const [account, setAccount] = useState<any>([]);
    const [currentAccount, setCurrentAccount] = useState<any>([]);
    const [showModal, setShowModal] = useState(false)
    const [showNameModal, setShowNameModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [initial, setInitiales] = useState('')
    const [nomInput, setNomInput] = useState("")

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                `Rejoins moi sur EcoEpargne et épargne ton argent en toute sécurité sur ton compte.`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                console.log('shared with activity type of ', result.activityType)
                } else {
                // shared
                console.log('Shared')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed')
                // dismissed
            }
        } catch (error) {
                console.log(error);
            }
        };

    let isMounted = true;
    const getCurrentAccount = async () => {
        try {
            if (isMounted)
            {
                const response:any = await get_user_local();
                setCurrentAccount(response)
                let words = response?.nom_complet
                words = words.split(' ')
                const initials = words.slice(0, 2).map((word: any) => word.charAt(0))
                const initialsString = initials.join('')
                setInitiales(initialsString)
                // console.log('res', words)
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCurrentAccount();
        return () => {
            isMounted = false;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        let isMounted = true;
        const getAccount = async () => {
            try {
                if (isMounted)
                {
                    setAccount(await getAllAccounts())
                }
                
            } catch (error) {
                console.error(error);
            }
        }

        getAccount();
        return () => {
            isMounted = false;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const choixCompte = async (num_compte: any, sta: any) => {
        try {
            // Vérifie si le compte est déjà actif
            if (parseInt(sta) === 1) {
                setShowModal(false); // Fermer le modal
                return; // Rien d'autre à faire
            }
    
            // Tente de changer le compte actif
            const success = await changeAccount(num_compte);
    
            // Si le changement a réussi, navigue vers LockScreen
            if (success) {
                setShowModal(false);
                navigation.navigate('LockScreen');
            } else {
                alert('Erreur lors du changement de compte');
            }
        } catch (error) {
            console.error('Erreur dans choixCompte:', error);
            alert('Une erreur inattendue est survenue');
        }
    };

    const addCompte = async () => {
        setShowModal(false)
        await changeAccount('add')
        navigation.navigate('Connexion')
    }

    const SeDeconnecter = () => {
        Alert.alert(
            'Confirmation',
            'Voulez-vous vous déconnecter ?',
        [
            {
              text: 'Oui',
              onPress: async () => 
              [
                setLoading(true),
                await logout()
                .then((result) => {
                  setLoading(false)
                  if(result === 200){
                    console.log(result)
                    navigation.navigate("Connexion")
                  }
                }
                )
                .catch((error) => {
                  setLoading(false)
                  console.log(error)
                }
                )
              ]
            },
            {
              text: 'Non',
              onPress: () => console.log('No Pressed')
            }
          ],
          { cancelable: false }
        );
    }

    function AccountSwitcherModal(){
        return (
            <Modal visible={showModal} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View className="flex-1 bg-black/10 items-center justify-center">
                        <View className="bg-white w-[99%] z-20 p-3 absolute bottom-0 rounded-t-2xl">

                            <View className='flex flex-row items-center justify-between mb-3'>
                                <Text style={{fontFamily: "SemiBold"}} className='text-xl'>Choisir un compte</Text>
                                <TouchableOpacity onPress={() => setShowModal(false)}>
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* Comptes */}
                            <View className='flex-col gap-3 mb-4'>
                                {account && account.map((acc:any, index:any) => (
                                    <TouchableOpacity key={index} onPress={() => choixCompte(acc.num_compte, acc.sta)}>
                                        <View className='flex-row items-center justify-between'>
                                            <Image source={require('../../assets/images/user.png')} className='w-10 h-10' />
                                            <View className='w-[78%]'>
                                                <Text style={{fontFamily: "SemiBold"}} className='text-[17px]'>{acc.nom_complet}</Text>
                                                <Text style={{fontFamily: "Regular"}} className='text-[14px]'>{acc.numero}</Text>
                                            </View>
                                            
                                            {/* Compte actif */}
                                            {acc.sta === 1 ? <Entypo name="check" size={24} color="green" /> : <View className='w-[5%]'></View>}
                                            
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Ajouter un autre compte */}
                            <TouchableOpacity className='items-center flex-row gap-2 mb-6' onPress={addCompte}>
                                <View className='w-10 h-10 bg-gray-200 items-center justify-center rounded-full'>
                                    <Image source={require('../../assets/images/add-friend.png')} className='w-6 h-6' />
                                </View>
                                <Text style={{fontFamily: "SemiBold"}} className='text-[15px]'>Ajouter un autre compte</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
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

    const handleValideNom = () => {
        // setLoading(true)
        console.log(nomInput)
        Alert.alert(
            'Confirmation',
            'Voulez-vous enregistrer cette modification ?',
        [
            {
              text: 'Oui',
              onPress: async () => 
              [
                setLoading(true),
                await updateNom(nomInput)
                .then(async(result) => {
                  setLoading(false)
                  if(result === 200){
                    await getCurrentAccount()
                    setShowNameModal(false)
                    setLoading(false)
                  }
                  else{
                    alert('Erreur lors de l\'enregistrement')
                    setShowNameModal(false)
                    setLoading(false)
                  }
                }
                )
                .catch((error) => {
                  setLoading(false)
                  setShowNameModal(false)
                  console.log(error)
                }
                )
              ]
            },
            {
              text: 'Non',
              onPress: () => console.log('No Pressed')
            }
          ],
          { cancelable: false }
        );
    }

    function renderNameModal () {
        return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showNameModal}
            onRequestClose={() => setShowNameModal(false)}
            
          >
            <View className='bg-black/20 flex-1 items-center justify-center'>
              <View className='bg-white w-[90%] p-4 rounded-lg'>
                <Text>Entrez votre nom</Text>
                <TextInput
                  className='bg-slate-100 border border-slate-200 rounded-lg p-3 mt-2'
                  onChangeText={(text) => setNomInput(text)}
                  value={nomInput}
                />
    
                <TouchableOpacity className='mt-3 p-3 items-center justify-center bg-gray-800 rounded-2xl' 
                  onPress={handleValideNom}>
                  <Text className='text-white font-bold'>Valider</Text>
                </TouchableOpacity>
    
                <TouchableOpacity className='mt-3 p-3 items-center justify-center bg-gray-200 rounded-2xl' 
                  onPress={() => setShowNameModal(false)}>
                  <Text className='text-black font-bold'>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )
    }

    if (!fontsLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='py-6 p-4'>
                {/* <StatusBar style='dark' backgroundColor='white' /> */}

                <View className="items-center justify-center">
                    {/* Image */}
                    <View className="bg-blue-500/50 w-28 h-28 rounded-full items-center justify-center">
                        <Text className="text-4xl font-bold text-white">{initial}</Text>
                    </View>
                    <TouchableOpacity onPress={() => [setNomInput(currentAccount?.nom_complet), setShowNameModal(true)]}>
                        <Text className="mt-3 text-2xl font-bold" style={{fontFamily : 'Bold'}}>{currentAccount?.nom_complet}</Text>
                        <View className='absolute -right-5 bg-slate-300 p-1 rounded-full -top-2'>
                            <MaterialIcons name="edit" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontFamily: "Light"}}>{currentAccount?.numero}</Text>
                </View>

                <View className="p-3 mt-4">

                    <View className="border-t border-slate-300 p-4 ">
                        <TouchableOpacity
                        className="flex-row items-center justify-between "
                        onPress={() => setShowModal(true)}
                        >
                        <View className='bg-green-600/40 p-2 rounded-full'>
                            <Image source={require('../../assets/images/change-account.png')} className='w-8 h-8 bg-cover' />
                        </View>
                        <Text className="w-full ml-3 text-[13px]" style={{fontFamily : 'SemiBold'}}>
                            Ajouter/Changer compte
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="border-t border-slate-300 p-4 ">
                        <TouchableOpacity
                        className="flex-row items-center justify-between "
                        >
                        <View className='bg-[#FBDD56]/40 p-2 rounded-full'>
                            <Image source={require('../../assets/images/key.png')} className='w-8 h-8 bg-cover' />
                        </View>
                        <Text className="w-full ml-3 text-[13px]" style={{fontFamily : 'SemiBold'}}>
                            Changer son mot de passe
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="border-t border-slate-300 p-4 ">
                        <TouchableOpacity
                        className="flex-row items-center justify-between "
                        onPress={() => onShare()}
                        >
                        <View className='bg-[#9dd6f4]/70 p-2 rounded-full'>
                            <Image source={require('../../assets/images/sharing.png')} className='w-8 h-8 bg-cover' />
                        </View>
                        <Text className="w-full ml-3 text-[13px]" style={{fontFamily : 'SemiBold'}}>
                            Inviter vos amis à rejoindre
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="border-t border-slate-300 p-4 ">
                        <TouchableOpacity
                        className="flex-row items-center justify-between "
                        >
                        <View className='bg-[#E07F84]/70 p-2 rounded-full'>
                            <Image source={require('../../assets/images/24-hours-support.png')} className='w-8 h-8 bg-cover' />
                        </View>
                        <Text className="w-full ml-3 text-[13px]" style={{fontFamily : 'SemiBold'}}>
                            Nous contacter
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Compte */}
                {/* <View className='mb-4'>
                    <Text className='p-3 text-[18px]' style={{fontFamily: "SemiBold"}}>Comptes</Text>
                    <View className='w-full bg-white rounded-lg p-3 flex-col'>
                        <TouchableOpacity className='items-center flex-row gap-2' onPress={() => setShowModal(true)}>
                            <Image source={require('../../assets/images/user.png')} className='w-8 h-8' />
                            <View>
                                <Text style={{fontFamily: "Bold"}} className='text-xl'>{currentAccount?.nom_complet}</Text>
                                <Text style={{fontFamily: "Light"}}>{currentAccount?.numero}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View> */}

                {/* Partager */}
                {/* <View className='mb-4'>
                    <Text className='p-3 text-[18px]' style={{fontFamily: "SemiBold"}}>Partager</Text>
                    <View className='w-full bg-white rounded-lg p-3 flex-col'>
                        <TouchableOpacity className='items-center flex-row gap-2 w-full'>
                            <Image source={require('../../assets/images/customer-service.png')} className='w-8 h-8' />
                            <Text style={{fontFamily: "Regular"}} className='text-[16px] text-wrap'>Invitez vos amis à rejoindre EcoEpargne</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

                {/* Service */}
                {/* <View className='mb-4'>
                    <Text className='p-3 text-[18px]' style={{fontFamily: "SemiBold"}}>Service client</Text>
                    <View className='w-full bg-white rounded-lg p-3 flex-col'>
                        <TouchableOpacity className='items-center flex-row gap-2'>
                            <Image source={require('../../assets/images/customer-service.png')} className='w-8 h-8' />
                            <View>
                                <Text style={{fontFamily: "Regular"}} className='text-[16px]'>Contactez-nous</Text>
                                <Text style={{fontFamily: "Regular"}} className='text-[16px]'>0797799890</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View> */}
                
                {/* Securité */}
                {/* <View className='mb-4'>
                    <Text className='p-3 text-[18px]' style={{fontFamily: "SemiBold"}}>Sécurité</Text>
                    <View className='w-full bg-white rounded-lg p-3 flex-col'>
                        <TouchableOpacity className='items-center flex-row gap-2 w-full'>
                            <Image source={require('../../assets/images/reset-password.png')} className='w-8 h-8' />
                            <Text style={{fontFamily: "Regular"}} className='text-[16px] text-wrap'>Changer le mot de passe</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                
                {/* Déconnexion */}
                <TouchableOpacity className='flex-row justify-center items-center w-full rounded-lg p-3 mt-4' onPress={SeDeconnecter}>
                    <Image source={require('../../assets/images/logout.png')} tintColor="#000" className='w-8 h-8' />
                    <Text style={{fontFamily: "Regular"}} className='text-[16px] text-wrap ml-2 text-black'>Se déconnecter</Text>
                </TouchableOpacity>
                {AccountSwitcherModal()}
                {renderNameModal()}
                {chargement()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Parametre