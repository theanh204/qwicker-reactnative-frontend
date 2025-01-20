#!/bin/bash

# Lấy địa chỉ IP của Wi-Fi
ipAddress=$(ipconfig getifaddr en1)

# Đường dẫn đến file cấu hình
configFile="./src/configs/APIv3.js"

# Thay thế giá trị của biến IP trong file config.js
sed -i "" "s|const IP = \".*\"|const IP = \"$ipAddress\"|" $configFile

echo "Đã cập nhật IP mới vào file config.js"

echo "Khởi động simulator iPhone 16..."
xcrun simctl boot "iPhone 16"
wait

# echo "Khởi động Android ..."
# emulator -avd Medium_Phone_API_35 &
wait
# 2. Mở Expo cho iOS (cổng 19005)
npx expo start --go --ios --port 19005
# npx expo start --go --ios --android --port 19005
