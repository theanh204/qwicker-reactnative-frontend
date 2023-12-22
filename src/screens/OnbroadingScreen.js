import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../constants';
const { width, height } = Dimensions.get('window')
const OnbroadingScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView className="flex-1">
            <Onboarding
                onDone={() => navigation.navigate(ROUTES.LOGIN)}
                onSkip={() => navigation.navigate(ROUTES.LOGIN)}
                pages={[
                    {
                        backgroundColor: '#fff',
                        image:
                            (<View>
                                <LottieView style={{ width: 300, height: 300 }} source={require('../assets/animations/onboarding1.json')} autoPlay loop />
                            </View>),
                        title: 'Yên tâm giao hàng nhanh chóng và đảm bảo',
                        subtitle: ''
                    },
                    {
                        backgroundColor: '#fff',
                        image:
                            (<View>
                                <LottieView style={{ width: 300, height: 300 }} source={require('../assets/animations/onboarding4.json')} autoPlay loop />
                            </View>),
                        title: 'Tài xế có thể ứng tiền trước tại điểm lấy hàng',
                        subtitle: ''
                    },
                    {
                        backgroundColor: '#fff',
                        image:
                            (<View>
                                <LottieView style={{ width: 300, height: 300 }} source={require('../assets/animations/onboarding3.json')} autoPlay loop />
                            </View>),
                        title: 'Dịch vụ đa dạng đáp ứng mọi nhu cầu của bạn',
                        subtitle: ''
                    },
                ]}
            />
        </SafeAreaView>
    )
}

export default OnbroadingScreen