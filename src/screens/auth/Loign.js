import { View, Text, Image, TextInput, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ROUTES } from '../../constants'
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const Loign = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView className="flex-1 flex-col justify-around h-full">
            <View className='basis-5/6 items-center justify-center'>
                <Text className='text-5xl font-normal'>Đăng nhập</Text>
                <View className="w-full px-5 mt-6 flex space-y-4">
                    <View className="rounded-2xl border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
                        <TextInput placeholderTextColor={'#A5A5A5'} placeholder="Email" />
                    </View>
                    <View className="rounded-2xl border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
                        <TextInput placeholderTextColor={'#A5A5A5'} placeholder="Email" />
                    </View>
                    <TouchableOpacity
                        className={`w-full flex bg-[#3422F1] items-center rounded-2xl p-4`}
                        onPress={() => navigation.navigate(ROUTES.HOME)}
                    >
                        <Text className="text-lg font-normal text-white">Đăng nhập</Text>
                    </TouchableOpacity>
                    <View className="flex-col space-y-3">
                        <Text className="text-center text-gray-500 font-medium text-sm">hoặc đăng nhập bằng</Text>
                        <View className="flex-row justify-center space-x-4">
                            <TouchableOpacity className="border-2 border-gray-400 rounded-full p-3">
                                <AntDesign name="googleplus" size={28} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity className="border-2 border-gray-400 rounded-full p-3">
                                <EvilIcons name="sc-facebook" size={28} color="#316FF6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View className='basis-1/6 pb-2 flex justify-end'>
                <TouchableOpacity className='w-ful flex p-2 items-center'>
                    <Text className="text-lg font-bold text-[#3422F1]">Quên mật khẩu?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className='w-ful flex p-2 items-center'
                    onPress={() => navigation.navigate(ROUTES.CHOOSEACCOUNT)}
                >
                    <Text className="text-lg font-bold text-[#3422F1]">Bạn chưa có tài khoản?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Loign