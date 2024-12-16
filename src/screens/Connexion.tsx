import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import React, {useEffect, useState} from 'react'
import useCustomFonts from '../constants/FONTS';
import { StatusBar } from 'expo-status-bar';
import  {db} from '../db'
import { utilisateur, temp } from '../db/schema';
import { eq, sql, and, count } from 'drizzle-orm';
import { storeUserDatas } from '../services/AsyncStorage';

const Connexion = ({navigation}:any) => {
    const fontsLoaded = useCustomFonts();

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        numero: '',
        nom: '',
    }) 

    useEffect(() => {
        const backAction = () => {
          // Affiche une alerte avant de quitter
        //   Alert.alert("Quitter", "Voulez-vous vraiment quitter l'application ?", [
        //     {
        //       text: "Non",
        //       onPress: () => null,
        //       style: "cancel",
        //     },
        //     { text: "Oui", onPress: () => BackHandler.exitApp() },
        //   ]);
          return true; // Bloque le retour en arrière
        };
    
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
    
        // Nettoyage : supprimer l'événement lorsque le composant est démonté
        return () => backHandler.remove();
    }, []);

    if (!fontsLoaded) {
        return undefined; // Render a loading indicator or something else
    }

    const handleSubmit = async () => {
        
        if(userData.numero != '' && userData.nom != '')
        {
            setLoading(true)
            const regex = /^(07|05|01)[0-9]{8}$/
            if(regex.test(userData.numero))
            {
                try {
                    const res = await db.select().from(utilisateur).where(eq(utilisateur.numero, userData.numero))
                    if(res.length == 0)
                    {
                        const countryCode = "CI";
                        const uti = await db.select({ value: count(utilisateur.id) }).from(utilisateur);
                        let num = 1;

                        if(uti.length > 0)
                        {
                            num = uti[0].value + 1;
                        }

                        const date = new Date();
                        const year = date.getFullYear().toString().slice(-2); // Les deux derniers chiffres de l'année
                        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois sur deux chiffres
                        const day = date.getDate().toString().padStart(2, '0'); // Jour sur deux chiffres
                        const heure = date.getHours().toString().padStart(2, '0'); //
                        const minute = date.getMinutes().toString().padStart(2, '0'); // Minute sur deux chiffres
                        const seconde = date.getSeconds().toString().padStart(2, '0'); // Seconde sur deux chiffres

                        const compte_num :string = `${countryCode}-${num.toString().padStart(3, '0')}-${`${year}${month}${day}${heure}${minute}${seconde}`}`;

                        const str: string[] = userData.nom.split(' ')
                        if(str.length < 1){
                            alert('Veuillez saisir un nom et un prénoms svp.')
                            setLoading(false)
                            return;
                        }

                        const newUser:any = await db.insert(utilisateur).values({numero: userData.numero, nomcomplet: userData.nom, num_compte: compte_num}).returning({ id: utilisateur.id });
                        
                        const code = Math.floor(1000 + Math.random() * 9000);
                        date.setMinutes(date.getMinutes() + 2); // Ajoute 2 minutes
                        const formattedDate = date;

                        const insert_temp:any = await db.insert(temp).values({
                            compte: compte_num,
                            code_verification: code,
                            date_expiration: formattedDate
                        });

                        const user = [
                            {num_compte: compte_num, nomcomplet: userData.nom, numero: userData.numero }
                        ]

                        storeUserDatas(user)
                        setLoading(false)
                        navigation.navigate('Code')
                    }
                    else
                    {
                        const date = new Date();
                        const code = Math.floor(1000 + Math.random() * 9000);
                        date.setMinutes(date.getMinutes() + 2); // Ajoute 2 minutes
                        const formattedDate = date;

                        const insert_temp:any = await db.insert(temp).values({
                            compte: res[0].num_compte,
                            code_verification: code,
                            date_expiration: formattedDate
                        });

                        const user = [
                            {num_compte: res[0].num_compte, nomcomplet: userData.nom, numero: userData.numero }
                        ]

                        storeUserDatas(user)
                        setLoading(false)
                        navigation.navigate('Code')

                        // alert('Ce numéro de téléphone est déjà utilisé.')
                    }
                } catch (error) {
                    alert(error)
                }
            }
            else
            {
                setLoading(false)
                alert('Veuillez saisir un numéro de téléphone valide')
            }
        }
        else
        {
            setLoading(false)
            alert('Veuillez remplir tous les champs')
        }
    }


    return (
        // --jsx
        // <ScrollView className='flex-1 px-5 py-10 bg-gray-300'>
        //     <StatusBar style='dark' backgroundColor='white' />
            
        //     <View className='items-center text-center'>
        //         <Image className='w-60 h-60' source={require('../assets/images/logo.png')} />
        //         <Text style={{fontFamily: "Light", fontSize: 18 }} className='text-center'>
        //             Bienvenue sur <Text style={{fontFamily: "Bold" }} className='text-red-600'>Eco<Text className='text-blue-800'>Epargne</Text></Text>!
        //             Veuillez entrer votre numéro et votre nom pour commencer à gérer votre budget personnel.
        //         </Text>
                
        //     </View>

        //     <View className='flex-1 items-center h-full w-full justify-end mt-16 bg-white'>
        //         <TextInput
        //             placeholder='0X 07 07 07 07'
        //             className='border-b-2 border-gray-300 focus:border-blue-800 p-3 w-full mb-11'
        //             keyboardType='number-pad'
        //             onChangeText={(text) => setUserData({...userData, numero: text})}
        //             value={userData.numero}
        //             maxLength={10}
        //         />

        //         <TextInput
        //             placeholder='Nom complet'
        //             className='border-b-2 border-gray-300 focus:border-blue-800 p-3 w-full mb-11'
        //             keyboardType='default'
        //             onChangeText={(text) => setUserData({...userData, nom: text})}
        //             value={userData.nom}
        //         />

        //         <TouchableOpacity className='p-4 bg-blue-800 rounded-full absolute -bottom-32' onPress={handleSubmit} >
                    
        //             <Text style={{fontFamily: "Bold", fontSize: 18 }} className='text-center text-white'>
        //                 Suivant {loading && <ActivityIndicator size='small' color='white' className='ml-2' />}
        //             </Text>
        //         </TouchableOpacity>

        //         <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        //             <Text style={{fontFamily: "Bold", fontSize: 18 }} className='text-center text-red-600'>Connexion</Text>
        //         </TouchableOpacity>
        //     </View>
        // </ScrollView>
        // <SafeAreaView className='flex-1'>
        <ScrollView contentContainerStyle={{flexGrow: 1}} className='flex-1 h-full py-10 bg-gray-200'>
                {/* <StatusBar style='dark' backgroundColor='auto' /> */}
                <View className='items-center'>
                    <Image className='w-80 h-80' source={require('../assets/images/logo.png')} />
                </View>

                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0} className='bg-white w-full h-full p-5 rounded-t-3xl'>
                    <Text style={{fontFamily: "Bold", fontSize: 30 }}>
                        Bienvenue sur 
                    </Text>
                    <Text style={{fontFamily: "Bold" }} className='text-red-600 font-bold text-4xl'>Eco<Text className='text-blue-800'>Epargne</Text></Text>
                    <View className='mt-6'>
                        <View>
                            <Text style={{fontFamily: "Bold" }}>Numéro de téléphone</Text>
                            <TextInput
                                placeholder='0X 07 07 07 07'
                                placeholderTextColor="#000"
                                className='border-b-2 border-gray-300 focus:border-blue-800 p-3 w-full mb-6'
                                keyboardType='number-pad'
                                onChangeText={(text) => setUserData({...userData, numero: text})}
                                value={userData.numero}
                                maxLength={10}
                            />
                        </View>
                        <View>
                            <Text style={{fontFamily: "Bold" }}>Nom complet</Text>
                            <TextInput
                                placeholder='Jean Paul'
                                className='border-b-2 border-gray-300 focus:border-blue-800 p-3 w-full mb-11'
                                keyboardType='default'
                                onChangeText={(text) => setUserData({...userData, nom: text})}
                                value={userData.nom}
                            />
                        </View>

                        <TouchableOpacity className='flex-grow bg-blue-600 p-4 rounded-2xl items-center' disabled={loading} onPress={handleSubmit}>
                            <Text className='text-white' style={{fontFamily: "Bold" }}>
                                Valider {loading && <ActivityIndicator size='small' color='white' className='ml-2' />}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </ScrollView>
        // </SafeAreaView>
    )
}

export default Connexion