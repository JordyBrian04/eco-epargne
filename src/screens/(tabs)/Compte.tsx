import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, RefreshControl, Image, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import useCustomFonts from '../../constants/FONTS';
import {Entypo, FontAwesome6 } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getEpargne, insertEpargne } from '../../services/OnlineRequest';
import { useFocusEffect } from '@react-navigation/native';

const Compte = ({navigation}:any) => {
  const fontsLoaded = useCustomFonts();
  const [showModal, setShowModal] = useState(false)
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [epargneArray, setEpargneArray] = useState<any>([])
  const [refresh, setRefreshing] = useState(false);
  const [epargne, setEpargne] = useState({
    libelle: '',
    type_epargne: '',
    date_fin: '',
  })

  const getEpargneList = async () => {
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

  // useEffect(() => {
  //   getEpargneList()
  // }, [])

  if (!fontsLoaded) {
      return (
          <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
              <Text>Chargement...</Text>
          </SafeAreaView>
      );
  }

  const toggleDatePicker = () => {
    setOpen(!open)
  }

  const confirmIOSDate = () => {
    const current_type = epargne.type_epargne
    const currentDate = new Date(); // Crée une nouvelle instance de la date actuelle
    let newDate;
    let jours;
    //console.log('confirmIOSDate', date)

    if (current_type === 'Epargne simple') {
      // console.log('20 jours');
      jours = '20 jours'
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 20);
    } else if (current_type === 'Epargne pro') {
      // console.log('40 jours');
      jours = '40 jours'
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 40);
    } 
    else if (current_type == '')
    {
      alert("Veuillez sélectionner un type d'épargne")
      return
    }
    else {
      return; // Si aucun type valide n'est sélectionné, on arrête
    }

    if(date < newDate)
    {
      alert("La date de fin de l'"+current_type+" est de "+jours)
      setEpargne({
        ...epargne,
        date_fin: newDate.toISOString().substring(0, 10)
      })
    }
    else
    {
      setEpargne({
        ...epargne,
        date_fin: date.toISOString().substring(0, 10)
      })
    }


    toggleDatePicker()
  }

  const changeTypeEpargne = (type: any) => {
    const currentDate = new Date(); // Crée une nouvelle instance de la date actuelle
    let newDate;
  
    if (type === 'Epargne simple') {
      console.log('20 jours');
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 20);
    } else if (type === 'Epargne pro') {
      console.log('40 jours');
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 40);
    } else {
      return; // Si aucun type valide n'est sélectionné, on arrête
    }
  
    // Met à jour l'état avec la nouvelle date formatée
    setEpargne({
      ...epargne,
      date_fin: newDate.toISOString().substring(0, 10), // Format YYYY-MM-DD
      type_epargne: type,
    });
  
    // Affiche la nouvelle date dans la console pour vérification
    console.log('Nouvelle date : ', newDate.toISOString().substring(0, 10));
  };

  const onChange = ({ type }: any, selectedDate: any) => {
    if (type === 'set') {
      const currentDate = selectedDate
      setDate(currentDate)

      if (Platform.OS === 'android') {
        toggleDatePicker()

        //On attribu la date à la valeur date (currentDate.toLocaleDateString('fr-FR'))
        setEpargne({
          ...epargne,
          date_fin: currentDate.toISOString().substring(0, 10)
        })
        //console.log(currentDate.toISOString().substring(0, 10))
      }
    } else {
      toggleDatePicker()
    }
  }

  const TypeTransactionOptions = [
    { key: 1, value: 'Epargne simple' },
    { key: 2, value: 'Epargne pro' }
  ]

  const backAjout = () => {
    setShowModal(false)
    setEpargne({
      date_fin: '',
      type_epargne: '',
      libelle: ''
    })
  }

  const valideEpargne = async () => {
    setLoading(true)
    if(epargne.date_fin == '' || epargne.libelle == '' || epargne.type_epargne == '')
    {
      // console.log(epargne)
      alert('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }

    const resultat:any = await insertEpargne(epargne)
    setLoading(false)
    if(resultat?.rowCount > 0)
    {
      await getEpargneList()
      setShowModal(false)
      setEpargne({
        date_fin: '',
        type_epargne: '',
        libelle: ''
      })

    }
    else
    {
      alert('Erreur lors de la création')
    }
    console.log(resultat)
  }

  function NewEpargneModal(){
    return (
        <Modal visible={showModal} transparent animationType="slide">
            {/* <TouchableWithoutFeedback onPress={() => setShowModal(false)}> */}
                <View className="flex-1 bg-black/10 items-center justify-center">
                    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0} className="bg-white w-[99%] z-20 p-3 absolute bottom-0 rounded-t-2xl">
                        <View className='flex flex-row items-center justify-between mb-3'>
                            <Text style={{fontFamily: "SemiBold"}} className='text-xl'>Nouvel épargne</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Entypo name="cross" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View className='mb-4 flex-col gap-4'>

                          <View>
                            <Text style={{fontFamily: "Regular"}} className='text-[16px] mb-2 font-semibold'>Libellé</Text>
                            <TextInput
                              placeholder='Epargne pour ma maison'
                              value={epargne.libelle}
                              placeholderTextColor="#606060"
                              className='p-3 rounded-lg bg-gray-100 focus:border-blue-500'
                              onChangeText={(text) => setEpargne({...epargne, libelle: text})}
                            />
                          </View>

                          <View>
                            <Text style={{fontFamily: "Regular"}} className='text-[16px] mb-2 font-semibold'>Type d'épargne</Text>
                            <SelectList
                              data={TypeTransactionOptions}
                              setSelected={(val: any) => changeTypeEpargne(val)}
                              save='value'
                              placeholder="Sélectionnez le type d'épargne"
                              // defaultOption={key: 'value', value: 'value'}
                            />
                          </View>

                          <View>
                            <Text style={{fontFamily: "Regular"}} className='text-[16px] mb-2 font-semibold'>Date de retraire</Text>
                            {open && (
                              <DateTimePicker
                                mode="date"
                                display="spinner"
                                value={date}
                                onChange={onChange}
                                style={{height: 120, marginTop: 20, width: '100%'}}
                                textColor='#000'
                              />
                            )}

                            {open && Platform.OS === 'ios' && (
                              <View className='flex-row justify-around mb-3'>

                                <TouchableOpacity className='p-3 bg-gray-200 rounded-full'
                                  onPress={toggleDatePicker}
                                >
                                  <Text className='text-red-500 font-extrabold'>Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className='p-3 bg-gray-200 rounded-full' 
                                  onPress={confirmIOSDate}
                                >
                                  <Text className='text-green-500 font-extrabold'>Valider</Text>
                                </TouchableOpacity>
                              </View>
                            )}

                            {!open && (
                              <TouchableOpacity onPress={toggleDatePicker}>
                                <TextInput
                                  placeholder="Date de fin"
                                  placeholderTextColor='#000'
                                  className="border border-gray-300 p-3 rounded"
                                  editable={false}
                                  //value={tache.date}
                                  value={epargne.date_fin}
                                  onChangeText={e =>
                                    setEpargne({ ...epargne, date_fin: e })
                                  }
                                  onPressIn={toggleDatePicker}
                                />
                              </TouchableOpacity>
                            )}
                          </View>

                          <View className='flex-row items-center justify-between mb-3'>
                            <TouchableOpacity className='bg-slate-100 p-4 rounded-xl items-center w-[45%]' onPress={backAjout}>
                              <Text style={{fontFamily: "SemiBold"}}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={loading} className='bg-green-300 p-4 rounded-xl flex-row justify-center items-center w-[45%]' onPress={valideEpargne}>
                              <Text style={{fontFamily: "SemiBold"}}>Valider</Text>
                              {loading && <ActivityIndicator size='small' color='black' className='ml-2' />}
                            </TouchableOpacity>
                          </View>
                        </View>

                    </KeyboardAvoidingView>
                </View>
            {/* </TouchableWithoutFeedback> */}
        </Modal>
    )
}

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-"); // Découper la chaîne en année, mois et jour
  return `${day}/${month}/${year}`; // Recomposer la date dans le format désiré
};

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <ScrollView className='py-6 p-4'         refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshing} />}>
        <StatusBar style='dark' backgroundColor='white' />
        <Text style={{fontFamily: "Bold"}} className='text-2xl'>Mes épargnes</Text>

        <TouchableOpacity className='bg-blue-400 rounded-3xl p-4 mt-3 items-center' onPress={() => setShowModal(true)}>
          <Text style={{fontFamily: "SemiBold"}} className='text-white'>Nouvel épargne</Text>
        </TouchableOpacity>

        <View className='flex flex-col gap-3 my-auto mt-3'>
          {/*  */}

          {epargneArray && epargneArray.length > 0 && epargneArray.map((ep:any) => (
            <View key={ep.num_epargne} className='bg-white rounded-lg p-3 shadow-lg'>
              <TouchableOpacity onPress={() => navigation.navigate({name: 'DetailCompte', params:{num_epargne: ep.num_epargne}})}>

                <View className='flex-row items-center gap-2'>
                  <FontAwesome6 name="vault" size={24} color="red" />
                  <Text style={{fontFamily: "Bold"}} className='text-sm text-red-600'>{formatDate(ep.date_fin)}</Text>
                </View>

                <View className='flex-row items-center justify-between'>
                  <View>
                    <Text style={{fontFamily: "Bold"}} className='text-lg mb-2'>{ep.type_epargne}</Text>
                    <Text style={{fontFamily: "SemiBold"}} className='text-3xl text-[#0b25d7]'>{ep.solde.toLocaleString('fr-FR')} CFA</Text>
                    <Text style={{fontFamily: "Regular"}} className='text-lg'>{ep.libelle}</Text>
                  </View>
                  <Image source={require('../../assets/images/money.gif')} className='w-10 h-10' />
                </View>

                {/* <View className='m-3 flex-row items-center justify-between'>
                  <View className='items-start'>
                    <Text style={{fontFamily: "SemiBold"}} className='text-lg'>{ep.solde.toLocaleString('fr-FR')} CFA</Text>
                    <Text style={{fontFamily: "Light"}} className='text-sm'>Solde actuel</Text>
                  </View>

                  <View className='items-start'>
                    <Text style={{fontFamily: "SemiBold"}} className='text-lg'>{ep.solde == 0 ? ep.solde.toLocaleString('fr-FR') : ep.type_epargne == 'Epargne simple' ? (ep.solde - 200).toLocaleString('fr-FR') : (ep.solde - 750).toLocaleString('fr-FR')} CFA</Text>
                    <Text style={{fontFamily: "Light"}} className='text-sm'>Solde retrait</Text>
                  </View>
                </View> */}

                {/* <View className='bg-red-200 p-1 rounded-xl justify-center items-center mt-3'>
                  <Text style={{fontFamily: "Bold"}} className='text-sm text-red-600'>Solde disponible le {formatDate(ep.date_fin)}</Text>
                </View> */}
              </TouchableOpacity>
            </View>
          ))}

          {/* 

          <View className='bg-white rounded-lg p-3 shadow-lg'>
            <TouchableOpacity>
              <Text style={{fontFamily: "SemiBold"}} className='text-lg'>Epargne décembre</Text>

              <View className='m-3 flex-row items-center justify-between'>
                <View className='items-start'>
                  <Text style={{fontFamily: "SemiBold"}} className='text-lg'>10 000 CFA</Text>
                  <Text style={{fontFamily: "Light"}} className='text-sm'>Solde actuel</Text>
                </View>

                <View className='items-start'>
                  <Text style={{fontFamily: "SemiBold"}} className='text-lg'>9 800 CFA</Text>
                  <Text style={{fontFamily: "Light"}} className='text-sm'>Solde disponible</Text>
                </View>
              </View>

              <View className='bg-red-200 p-1 rounded-xl justify-center items-center mt-3'>
                <Text style={{fontFamily: "Bold"}} className='text-sm text-red-600'>Solde disponible le 22/11/2024</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className='bg-white rounded-lg p-3 shadow-lg'>
            <TouchableOpacity>
              <Text style={{fontFamily: "SemiBold"}} className='text-lg'>Epargne décembre</Text>

              <View className='m-3 flex-row items-center justify-between'>
                <View className='items-start'>
                  <Text style={{fontFamily: "SemiBold"}} className='text-lg'>10 000 CFA</Text>
                  <Text style={{fontFamily: "Light"}} className='text-sm'>Solde actuel</Text>
                </View>

                <View className='items-start'>
                  <Text style={{fontFamily: "SemiBold"}} className='text-lg'>9 800 CFA</Text>
                  <Text style={{fontFamily: "Light"}} className='text-sm'>Solde disponible</Text>
                </View>
              </View>

              <View className='bg-red-200 p-1 rounded-xl justify-center items-center mt-3'>
                <Text style={{fontFamily: "Bold"}} className='text-sm text-red-600'>Solde disponible le 22/11/2024</Text>
              </View>
            </TouchableOpacity>
          </View> */}

        </View>
        {NewEpargneModal()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Compte