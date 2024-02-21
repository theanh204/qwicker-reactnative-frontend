import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { ROLE, ROUTES } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { getRole } from '../../redux/appSlice'
import { logout } from '../../redux/store';
import { getBasicUserProfile } from '../../redux/basicUserSlice';
import { getShipperProfile } from '../../redux/shipperSlice';
const Setting = ({ navigation }) => {
    const role = useSelector(getRole)
    const dispatch = useDispatch()
    const { email } = role === ROLE.TRADITIONAL_USER ? useSelector(getBasicUserProfile) : useSelector(getShipperProfile)
    const logout = () => {
        // dispatch(logout())
        navigation.navigate(ROUTES.LOGIN)
    }

    return (
        <View className="flex-col flex-1 space-y-3 pt-3">
            <TouchableOpacity
                className="flex-row px-4 py-3 items-center justify-between bg-white"
            >
                <View>
                    <Text className="text-lg font-semibold">Thiết lập mật khẩu đăng nhập</Text>
                    <Text className="text-gray-500">Bạn hãy bấm vào đây để thay đổi mật khẩu</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
            <TouchableOpacity
                className="flex-row px-4 py-3 items-center justify-between bg-white"
            >
                <View>
                    <Text className="text-lg font-semibold">Thay đổi emaill</Text>
                    <Text className="text-gray-500">{email}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row px-4 py-3 items-center justify-between bg-white">
                <View>
                    <Text className="text-lg font-semibold">Ngôn ngữ</Text>
                    <Text className="text-gray-500">Tiếng việt</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row px-4 py-3 items-center justify-between bg-white">
                <View>
                    <Text className="text-lg font-semibold">Thông báo</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row px-4 py-3 items-center justify-between bg-white">
                <View>
                    <Text className="text-lg font-semibold">Bảo mật</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row px-4 py-3 items-center justify-between bg-white">
                <View>
                    <Text className="text-lg font-semibold">Về Qwiker</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-gray-400">v 1.0.0</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#D1D5DB" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={logout}
                className="flex justify-between items-center py-4 bg-white"
                style={role === ROLE.TRADITIONAL_USER && { position: 'absolute', left: 0, right: 0, bottom: 32 }}
            >
                <Text className="text-[#3422F1] text-lg font-medium">Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Setting