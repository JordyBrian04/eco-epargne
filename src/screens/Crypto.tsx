import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Share } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg';

const Crypto = () => {
    let bitcoinLogo = require('../assets/images/bitcoin1.png')
    let tronLogo = require('../assets/images/tron.png')
    let ethereumLogo = require('../assets/images/ethereum.png')

    const onShare = async (code:string) => {
        try {
          const result = await Share.share({
            message:
              `Utilise le code ${code} pour recharger ton compte Crypto.`,
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

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='py-6 p-4'>

                <Text className='mb-5 text-xl text-center font-bold'>Recevez vos cryptos en FCFA</Text>

                <View className='items-center justify-center'>
                    <QRCode
                        value="1KzK3cS8XPBFynkqusfgRSaVy7CuG9zrhW"
                        logo={bitcoinLogo}
                        size={150}
                    />
                </View>

                <View className='border border-gray-200 p-3 rounded-2xl mb-3 mt-3'>
                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Réseau</Text>
                        <Text className='text-black text-lg font-bold mb-2'>Bitcoin</Text>
                    </View>

                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Adresse de reception</Text>
                        <Text className='text-black text-lg font-bold mb-2'>1KzK3cS8XPBFynkqusfgRSaVy7CuG9zrhW</Text>
                    </View>

                    <TouchableOpacity className='mt-6 rounded-xl p-2 items-center bg-blue-600' onPress={() => onShare('1KzK3cS8XPBFynkqusfgRSaVy7CuG9zrhW')}>
                        <Text style={{fontFamily: 'SemiBold', color: 'white'}} className='text-xl mb-3'>Partager</Text>
                    </TouchableOpacity>

                </View>


                {/* Ethereum */}
                <View className='items-center justify-center mt-5'>
                    <QRCode
                        value="Oxebe413982b3dd6dca2e358b546f502d903ea154b"
                        logo={ethereumLogo}
                        size={150}
                    />
                </View>

                <View className='border border-gray-200 p-3 rounded-2xl mb-3 mt-3'>
                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Réseau</Text>
                        <Text className='text-black text-lg font-bold mb-2'>Ethereum (ERC20)</Text>
                    </View>

                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Adresse de reception</Text>
                        <Text className='text-black text-lg font-bold mb-2'>Oxebe413982b3dd6dca2e358b546f502d903ea154b</Text>
                        <Text className='text-red-500'>
                            DO NOT define your Binance deposit address as the receiving address for validator rewards. Validator rewards sent from the node to Binance deposit address is not supported and will not be credited. This will lead to asset loss.
                        </Text>
                    </View>

                    <TouchableOpacity className='mt-6 rounded-xl p-2 items-center bg-blue-600' onPress={() => onShare('Oxebe413982b3dd6dca2e358b546f502d903ea154b')}>
                        <Text style={{fontFamily: 'SemiBold', color: 'white'}} className='text-xl mb-3'>Partager</Text>
                    </TouchableOpacity>

                </View>

                {/* Tron */}
                <View className='items-center justify-center mt-5'>
                    <QRCode
                        value="Oxebe413982b3dd6dca2e358b546f502d903ea154b"
                        logo={tronLogo}
                        size={150}
                    />
                </View>

                <View className='border border-gray-200 p-3 rounded-2xl mb-3 mt-3'>
                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Réseau</Text>
                        <Text className='text-black text-lg font-bold mb-1'>Tron (TRC 20)</Text>
                        <Text className='text-gray-500 text-sm font-bold mb-2'>* Contract Information ***Lift</Text>
                    </View>

                    <View>
                        <Text className='text-gray-500 text-lg font-bold mb-2'>Adresse de reception</Text>
                        <Text className='text-black text-lg font-bold mb-2'>TPojZXELpsRTJqR6Xa9WoG6mPmnaAGtsVW</Text>
                        {/* <Text className='text-red-500'>
                            DO NOT define your Binance deposit address as the receiving address for validator rewards. Validator rewards sent from the node to Binance deposit address is not supported and will not be credited. This will lead to asset loss.
                        </Text> */}
                    </View>

                    <TouchableOpacity className='mt-6 rounded-xl p-2 items-center bg-blue-600' onPress={() => onShare('TPojZXELpsRTJqR6Xa9WoG6mPmnaAGtsVW')}>
                        <Text style={{fontFamily: 'SemiBold', color: 'white'}} className='text-xl mb-3'>Partager</Text>
                    </TouchableOpacity>

                </View>


                
            </ScrollView>
        </SafeAreaView>
    )
}

export default Crypto