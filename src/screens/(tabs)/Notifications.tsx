import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import useCustomFonts from '../../constants/FONTS';

const Notifications = () => {

  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
        <SafeAreaView className="flex-1 bg-slate-100 justify-center items-center">
            <Text>Chargement...</Text>
        </SafeAreaView>
    );
}

  return (
    <View className='bg-[#F9F7F7] flex-1 pt-8 pr-3 pl-3'>
      <ScrollView className='p-3 mt-4'>

        <View className='flex-row items-center justify-between'>

          <TouchableOpacity className='items-center justify-center p-6 rounded-3xl' style={{backgroundColor: 'rgba(255, 179, 27, 0.1)'}}>
            <Text className='text-sm text-[#FFB31B]' style={{fontFamily: "SemiBold"}}>Marquer comme lu</Text>
          </TouchableOpacity>

          <TouchableOpacity className='items-center justify-center p-6 rounded-3xl' style={{backgroundColor: 'rgba(253, 0, 0, 0.1)'}}>
            <Text className='text-sm text-[#FD0000]' style={{fontFamily: "SemiBold"}}>Vider</Text>
          </TouchableOpacity>

        </View>

        <View className='mt-4'>

          <View className='bg-white p-3 rounded-xl flex-row mb-3'>
            <View className='w-[87%]'>
              <Text className='text-sm' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, conseteturt</Text>
              <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut</Text>
            </View>

            <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>2 min</Text>
          </View>

          <View className='bg-white p-3 rounded-xl flex-row mb-3'>
            <View className='w-[87%]'>
              <Text className='text-sm' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, conseteturt</Text>
              <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut</Text>
            </View>

            <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>2 min</Text>
          </View>

          <View className='bg-white p-3 rounded-xl flex-row mb-3'>
            <View className='w-[87%]'>
              <Text className='text-sm' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, conseteturt</Text>
              <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut</Text>
            </View>

            <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>2 min</Text>
          </View>

          <View className='bg-white p-3 rounded-xl flex-row mb-3'>
            <View className='w-[87%]'>
              <Text className='text-sm' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, conseteturt</Text>
              <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut</Text>
            </View>

            <Text className='text-xs text-[#838383]' style={{fontFamily: 'Regular'}}>2 min</Text>
          </View>
          
        </View>
      </ScrollView>
    </View>
  )
}

export default Notifications