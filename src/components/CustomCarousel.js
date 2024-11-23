import * as React from "react";
import { Dimensions, Text, View, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
const { width, height } = Dimensions.get("window");
const data = [
  {
    title: "THỬ THÁCH NẠP VÍ",
    content: "Hoàn thành thử thách, mở gói quà Noel đến 2111k",
    image: require(`../assets/images/wallet.png`),
    bg: "#FB8B24",
  },
  {
    title: "TẶNG BẠN MỚI ƯU ĐÃI ĐỒNG GIÁ",
    content: "Nhập mã qwuiker - Đồng giá 99k đơn van-tải >",
    image: require(`../assets/images/discount.png`),
    bg: "#5D3587",
  },
  {
    title: "GIAO GÌ CŨNG NHANH - XE NÀO CŨNG CÓ",
    content: "Hàng nhỏ, hàng to, Qwiker giao nhanh dễ dàng >",
    image: require(`../assets/images/delivery.png`),
    bg: "#3887BE",
  },
  {
    title: "GIỚI THIỆT BẠN CÀI QWIKER",
    content: "Cùng nhận gói quà lên đến 500k >",
    image: require(`../assets/images/handshake.png`),
    bg: "#E36414",
  },
];
function CarouselItem({ props }) {
  const { title, content, image, bg } = props;
  return (
    <View
      className="flex-row justify-between items-center px-4 py-8 rounded-lg"
      style={{ backgroundColor: bg, height: height / 4 }}
    >
      <View className="basis-3/4  ">
        <Text className="text-white text-xl font-semibold mb-4">{title}</Text>
        <Text className="text-white text-lg">{content}</Text>
      </View>
      <View className="basis-1/4 flex justify-center">
        <Image source={image} className="w-[110] h-[110]" />
      </View>
    </View>
  );
}

const CustomCarousel = () => {
  return (
    <View style={{ height: height / 4 }}>
      {/* <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        pagingEnabled={true}
        mode="parallax"
        data={data}
        scrollAnimationDuration={1300}
        renderItem={({ item }) => (
          <CarouselItem key={item.title} props={{ ...item }} />
        )}
      /> */}
    </View>
  );
};

export default React.memo(CustomCarousel);
