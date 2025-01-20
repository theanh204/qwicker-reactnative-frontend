#!/bin/bash

# Lấy địa chỉ IP của Wi-Fi
ipAddress=$(ipconfig getifaddr en1)

# Đường dẫn đến file cấu hình
configFile="./src/configs/APIv3.js"

# Thay thế giá trị của biến IP trong file config.js
sed -i "" "s|const IP = \".*\"|const IP = \"$ipAddress\"|" $configFile
# 1. Khởi động Android Emulator
echo "Khởi động Android ..."
emulator -avd Medium_Phone_API_35 & 

# 2. Mở Expo cho Android (cổng 19010)
echo "Chạy Expo trên Android Emulator (cổng 19010)..."
npx expo start --go --android --port 19010

wait
